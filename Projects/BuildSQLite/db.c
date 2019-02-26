//
// Created by Austin Story on 2019-02-20.
//
#include "db.h"
#include <errno.h>
#include <fcntl.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

// https://www.geeksforgeeks.org/structures-c/
// Good writeup on structs
struct InputBuffer_t {
    char* buffer;

    // http://pubs.opengroup.org/onlinepubs/009696799/basedefs/sys/types.h.html
    size_t buffer_length; // size object in bytes
    ssize_t input_length; // size in bytes, but can be negative for error code
};

typedef struct InputBuffer_t InputBuffer;

// Constraint: adding row, only allowing id/username/email

const uint32_t COLUMN_USERNAME_SIZE = 32;
const uint32_t COLUMN_EMAIL_SIZE = 255;
struct Row_t {
  uint32_t id;
  // C Strings are null terminated.  Need an extra byte for that.
  char username[COLUMN_USERNAME_SIZE + 1];
  char email[COLUMN_EMAIL_SIZE + 1];
};

typedef struct Row_t Row;

InputBuffer* new_input_buffer() {
    InputBuffer* input_buffer = malloc(sizeof(InputBuffer));
    input_buffer->buffer = NULL;
    input_buffer->buffer_length = 0;
    input_buffer->input_length = 0;

    return input_buffer;
}

enum ExecuteResult_t { EXECUTE_SUCCESS, EXECUTE_TABLE_FULL };
typedef enum ExecuteResult_t ExecuteResult;

enum MetaCommandResult_t {
    META_COMMAND_SUCCESS,
    META_COMMAND_UNRECOGNIZED_COMMAND
};
typedef enum MetaCommandResult_t MetaCommandResult;

enum PrepareResult_t {
    PREPARE_SUCCESS,
    PREPARE_UNRECOGNIZED_STATEMENT,
    PREPARE_SYNTAX_ERROR,
    PREPARE_STRING_TOO_LONG,
    PREPARE_NEGATIVE_ID
};
typedef enum PrepareResult_t PrepareResult;

void print_prompt() { printf("db > "); }

// prepared statement
enum StatementType_t { STATEMENT_INSERT, STATEMENT_SELECT };
typedef enum StatementType_t StatementType;

struct Statement_t {
    StatementType type;
    Row row_to_insert; // used for insert statements
};

typedef struct Statement_t Statement;

PrepareResult prepare_insert(InputBuffer* input_buffer, Statement* statement) {
  statement->type = STATEMENT_INSERT;

    // scanf has issues with buffers https://stackoverflow.com/questions/2430303/disadvantages-of-scanf
    char* keyword = strtok(input_buffer->buffer, " ");
    char* id_string = strtok(NULL, " ");
    char* username = strtok(NULL, " ");
    char* email = strtok(NULL, " ");

    if (id_string == NULL || username == NULL || email == NULL){
        return PREPARE_SYNTAX_ERROR;
    }

    int id = atoll(id_string);

    if (id < 0) {
        return PREPARE_NEGATIVE_ID;
    }

    if (strlen(username) > COLUMN_USERNAME_SIZE) {
        return PREPARE_STRING_TOO_LONG;
    }

    if (strlen(email) > COLUMN_EMAIL_SIZE) {
        return PREPARE_STRING_TOO_LONG;
    }

    statement->row_to_insert.id = id;
    strcpy(statement->row_to_insert.username, username);
    strcpy(statement->row_to_insert.email, email);

    return PREPARE_SUCCESS;
}

PrepareResult prepare_statement(InputBuffer* input_buffer, Statement* statement) {
    // on insert for initial pass, only allow id/username/email
    if (strncmp(input_buffer->buffer, "insert", 6)==0) {
        return prepare_insert(input_buffer, statement);
    }
    if (strcmp(input_buffer->buffer, "select")==0) {
        statement->type = STATEMENT_SELECT;
        return PREPARE_SUCCESS;
    }

  return PREPARE_UNRECOGNIZED_STATEMENT;
}

/*
 * For storage, we are going to start with some constraints to keep it simple
 * - store rows in blocks of memory "pages"
 * - each row stores as many rows as it can fit
 * - rows are serialized into a compact format
 * - pages allocated as needed
 * - keep fixed-sized array of pointers to pages
 *
 * id - 4 bytes - offset 0
 * username - 32 bytes - offset 4
 * email - 255 bytes - offset 36
 * total - 291
 */

#define size_of_attribute(Struct, Attribute) sizeof(((Struct*)0)->Attribute)

const uint32_t ID_SIZE = size_of_attribute(Row, id);
const uint32_t USERNAME_SIZE = size_of_attribute(Row, username);
const uint32_t EMAIL_SIZE = size_of_attribute(Row, email);
const uint32_t ID_OFFSET = 0;
const uint32_t USERNAME_OFFSET = ID_OFFSET + ID_SIZE;
const uint32_t EMAIL_OFFSET = USERNAME_OFFSET + USERNAME_SIZE;
const uint32_t ROW_SIZE = ID_SIZE + USERNAME_SIZE + EMAIL_SIZE;

// Convert to and from storage
void print_row(Row* row) {
    printf("(%d, %s, %s)\n", row->id, row->username, row->email);
}

void serialize_row(Row* source, void* destination) {
    memcpy(destination + ID_OFFSET, &(source->id), ID_SIZE);
    memcpy(destination + USERNAME_OFFSET, &(source->username), USERNAME_SIZE);
    memcpy(destination + EMAIL_OFFSET, &(source->email), EMAIL_SIZE);
}

void deserialize_row(void* source, Row* destination) {
    memcpy(&(destination->id), source + ID_OFFSET, ID_SIZE);
    memcpy(&(destination->username), source + USERNAME_OFFSET, USERNAME_SIZE);
    memcpy(&(destination->email), source + EMAIL_OFFSET, EMAIL_SIZE);
}

// Table to hold our pages
const uint32_t PAGE_SIZE = 4096; // popular size for virtual memory on most architectures
const uint32_t TABLE_MAX_PAGES = 100;
const uint32_t ROWS_PER_PAGE = PAGE_SIZE / ROW_SIZE;
const uint32_t TABLE_MAX_ROWS = ROWS_PER_PAGE * TABLE_MAX_PAGES;

// Create a pager to handle persisting/loading/caching the db tables
struct Pager_t {
  // file descriptors index into a per-process file descriptor table maintained by the kernel
  int file_descriptor;
  uint32_t file_length;
  void* pages[TABLE_MAX_PAGES];
};
typedef struct Pager_t Pager;

struct Table_t {
    Pager* pager;
    uint32_t num_rows;
};
typedef struct Table_t Table;

void* get_page(Pager* pager, uint32_t page_num) {
  if (page_num > TABLE_MAX_PAGES){
    printf("Tried to fetch page number out of bounds. %d > %d\n", page_num, TABLE_MAX_PAGES);
    exit(EXIT_FAILURE);
  }

  if (pager->pages[page_num] == NULL) {
    // Cache miss.  Allocate memory and load from file.
    void* page = malloc(PAGE_SIZE);
    uint32_t num_pages = pager->file_length / PAGE_SIZE;

    // Might save partial page at end of file
    if (pager->file_length % PAGE_SIZE) {
      num_pages += 1;
    }

    if (page_num <= num_pages){
      lseek(pager->file_descriptor, page_num * PAGE_SIZE, SEEK_SET);
      ssize_t bytes_read = read(pager->file_descriptor, page, PAGE_SIZE);
      if (bytes_read == -1){
        printf("Error reading file: %d\n", errno);
        exit(EXIT_FAILURE);
      }
    }

    pager->pages[page_num] = page;
  }

  return pager->pages[page_num];
}

// current design, length of file encodes how many rows are in database
// that is why pager_flush takes page and size
void pager_flush(Pager* pager, uint32_t page_num, uint32_t size) {
  if (pager->pages[page_num] == NULL) {
    printf("Tried to flush null page\n");
    exit(EXIT_FAILURE);
  }

  off_t offset = lseek(pager->file_descriptor, page_num * PAGE_SIZE, SEEK_SET);
  if (offset == -1) {
    printf("Error seeking: %d\n", errno);
    exit(EXIT_FAILURE);
  }

  ssize_t bytes_written = write(pager->file_descriptor, pager->pages[page_num], size);

  if (bytes_written == -1) {
    printf("error writing: %d\n", errno);
    exit(EXIT_FAILURE);
  }
}

// flush cache to disk/closedb/free memory
void db_close(Table* table) {
  Pager* pager = table->pager;
  uint32_t num_full_pages = table->num_rows / ROWS_PER_PAGE;

  for (uint32_t i = 0; i < num_full_pages; i++) {
    if (pager->pages[i] == NULL) {
      continue;
    }
    pager_flush(pager, i, PAGE_SIZE);
    free(pager->pages[i]);
    pager->pages[i] = NULL;
  }

  // Partial page at end of file
  uint32_t num_additional_rows = table->num_rows % ROWS_PER_PAGE;
  if (num_additional_rows > 0){
    uint32_t page_num = num_full_pages;
    if (pager->pages[page_num] != NULL) {
      pager_flush(pager, page_num, num_additional_rows * ROW_SIZE);
      free(pager->pages[page_num]);
      pager->pages[page_num] = NULL;
    }
  }

  int result = close(pager->file_descriptor);
  if (result == -1) {
    printf("Error closing db file.\n");
  }

  for (uint32_t i = 0; i < TABLE_MAX_PAGES; i++) {
    void* page = pager->pages[i];
    if (page){
      free(page);
      pager->pages[i] = NULL;
    }
  }
  free(pager);
}

MetaCommandResult do_meta_command(InputBuffer* input_buffer, Table* table) {
    if (strcmp(input_buffer->buffer, ".exit") == 0) {
        db_close(table);
        exit(EXIT_SUCCESS);
    } else {
        return META_COMMAND_UNRECOGNIZED_COMMAND;
    }
}

// where do we read/write in memory for a row
void* row_slot(Table* table, uint32_t row_num) {
    uint32_t page_num = row_num / ROWS_PER_PAGE;
    void* page = get_page(table->pager, page_num);
    uint32_t row_offset = row_num % ROWS_PER_PAGE;
    uint32_t byte_offset = row_offset * ROW_SIZE;

    return page + byte_offset;
}

ExecuteResult execute_insert(Statement* statement, Table* table) {
    if (table->num_rows >= TABLE_MAX_ROWS) {
        return EXECUTE_TABLE_FULL;
    }

    Row* row_to_insert = &(statement->row_to_insert);

    serialize_row(row_to_insert, row_slot(table, table->num_rows));
    table->num_rows += 1;

    return EXECUTE_SUCCESS;
}

// lookup the row in the table
// read in the row
ExecuteResult execute_select(Statement* statement, Table* table) {
    Row row;

    for (uint32_t i = 0; i < table->num_rows; i++) {
        deserialize_row(row_slot(table, i), &row);
        print_row(&row);
    }

    return EXECUTE_SUCCESS;
}

ExecuteResult execute_statement(Statement* statement, Table* table) {
    switch(statement->type) {
        case (STATEMENT_INSERT):
            return execute_insert(statement, table);
        case (STATEMENT_SELECT):
            return execute_select(statement, table);
    }
}

/*
 * ssize_t getline(char **lineptr, size_t *n, FILE *stream);
 * lineptr : a pointer to the variable we use to point to the buffer containing the read line.
 * n : a pointer to the variable we use to save the size of allocated buffer.
 * stream : the input stream to read from. We’ll be reading from standard input.
 * return value : the number of bytes read, which may be less than the size of the buffer.
 */
void read_input(InputBuffer* input_buffer) {
  ssize_t bytes_read;
  bytes_read = getline(&(input_buffer->buffer), &(input_buffer->buffer_length),stdin);

  if (bytes_read <= 0) {
      printf("Error reading input\n");
      exit(EXIT_FAILURE);
  }

  // strip trailing new lines
  input_buffer->input_length = bytes_read - 1;
  input_buffer->buffer[bytes_read - 1] = 0;
}

Pager* pager_open(const char* filename) {
  int fd = open(filename,
    O_RDWR | O_CREAT, // open read/write or create if doesn't exist
    S_IWUSR | S_IRUSR // User Write and User Read permissions
  );

  if (fd == -1) {
    printf("Unable to open file\n");
    exit(EXIT_FAILURE);
  }

  // lseek repositions read/write file offset http://man7.org/linux/man-pages/man2/lseek.2.html
  off_t file_length = lseek(fd, 0, SEEK_END);

  Pager* pager = malloc(sizeof(Pager));
  pager->file_descriptor = fd;
  pager->file_length = file_length;

  for (uint32_t i = 0; i < TABLE_MAX_PAGES; i++) {
    pager->pages[i] = NULL;
  }

  return pager;
}

Table* db_open(const char* filename) {
  Pager* pager = pager_open(filename);
  uint32_t num_rows = pager->file_length / ROW_SIZE;

  Table* table = malloc(sizeof(Table));
  table->pager = pager;
  table->num_rows = num_rows;

  return table;
}

int main(int argc, char* argv[]) {
    InputBuffer* input_buffer = new_input_buffer();

    if (argc < 2) {
      printf("Must supply a database filename.\n");
      exit(EXIT_FAILURE);
    }

    char* filename = argv[1];
    Table* table = db_open(filename);

    while (1) {
        print_prompt();
        read_input(input_buffer);

        if (input_buffer->buffer[0] == '.') {
            switch(do_meta_command(input_buffer, table)) {
                case (META_COMMAND_SUCCESS):
                    continue;
                case (META_COMMAND_UNRECOGNIZED_COMMAND): {
                    printf("Unrecognized command '%s'\n", input_buffer->buffer);
                    continue;
                }
            }
        }

        Statement statement;
        switch(prepare_statement(input_buffer, &statement)) {
            case (PREPARE_SUCCESS):
                break;
            case (PREPARE_SYNTAX_ERROR):
                printf("Syntax error.  Could not parse statement.\n");
                continue;
            case (PREPARE_STRING_TOO_LONG):
                printf("String is too long.\n");
                continue;
            case (PREPARE_NEGATIVE_ID):
                printf("ID must be positive.\n");
                continue;
            case (PREPARE_UNRECOGNIZED_STATEMENT):
                printf("Unrecognized keyword at start of '%s'.\n",
                        input_buffer->buffer);
                continue;
        }

        switch(execute_statement(&statement, table)){
            case (EXECUTE_SUCCESS):
                printf("Executed.\n");
                break;
            case (EXECUTE_TABLE_FULL):
                printf("Error: Table full.\n");
                break;
        }
    }
}
