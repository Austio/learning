//
// Created by Austin Story on 2019-02-20.
//

#include "db.h"
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct InputBuffer_t {
    char* buffer;

    // http://pubs.opengroup.org/onlinepubs/009696799/basedefs/sys/types.h.html
    size_t buffer_length; // size object in bytes
    ssize_t input_length; // size in bytes, but can be negative for error code
};

typedef struct InputBuffer_t InputBuffer;

InputBuffer* new_input_buffer() {
    InputBuffer* input_buffer = malloc(sizeof(InputBuffer));
    input_buffer->buffer = NULL;
    input_buffer->buffer_length = 0;
    input_buffer->input_length = 0;

    return input_buffer;
}

enum MetaCommandResult_t {
    META_COMMAND_SUCCESS,
    META_COMMAND_UNRECOGNIZED_COMMAND
};
typedef enum MetaCommandResult_t MetaCommandResult;

enum PrepareResult_t { PREPARE_SUCCESS, PREPARE_UNRECOGNIZED_STATEMENT };
typedef enum PrepareResult_t PrepareResult;

void print_prompt() { printf("db > "); }

MetaCommandResult do_meta_command(InputBuffer* input_buffer) {
    if (strcmp(input_buffer->buffer, ".exit") == 0) {
        exit(EXIT_SUCCESS);
    } else {
        return META_COMMAND_UNRECOGNIZED_COMMAND;
    }
}

// prepared statement
enum StatementType_t { STATEMENT_INSERT, STATEMENT_SELECT };
typedef enum StatementType_t StatementType;

struct Statement_t {
    StatementType type;
};

typedef struct Statement_t Statement;

// Detects the type of command
PrepareResult prepare_statement(InputBuffer* input_buffer, Statement* statement) {
    // compare first n bytes of 2 strings
    if (strncmp(input_buffer->buffer, "insert", 6)==0) {
        statement->type = STATEMENT_INSERT;
        return PREPARE_SUCCESS;
    }
    if (strcmp(input_buffer->buffer, "select")==0) {
        statement->type = STATEMENT_SELECT;
        return PREPARE_SUCCESS;
    }

  return PREPARE_UNRECOGNIZED_STATEMENT;
}

void execute_statement(Statement* statement) {
    switch(statement->type) {
        case (STATEMENT_INSERT):
            printf("Do an insert ");
            break;
        case (STATEMENT_SELECT):
            printf("Do a select ");
            break;
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

int main(int argc, char* argv[]) {
    InputBuffer* input_buffer = new_input_buffer();

    while (1) {
        print_prompt();
        read_input(input_buffer);

        if (input_buffer->buffer[0] == '.') {
            switch(do_meta_command(input_buffer)) {
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
            case (PREPARE_UNRECOGNIZED_STATEMENT):
                printf("Unrecognized keyword at start of '%s'.\n",
                        input_buffer->buffer);
                continue;
        }

        execute_statement(&statement);
        printf("Executed.\n");
    }
}
