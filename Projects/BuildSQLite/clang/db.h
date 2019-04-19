//
// Created by Austin Story on 2019-02-20.
//

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#ifndef LEARNING_REPL_H
#define LEARNING_REPL_H

// https://www.geeksforgeeks.org/structures-c/
// Good writeup on structs
struct InputBuffer_t {
    char* buffer;

    // http://pubs.opengroup.org/onlinepubs/009696799/basedefs/sys/types.h.html
    size_t buffer_length; // size object in bytes
    ssize_t input_length; // size in bytes, but can be negative for error code
};

const uint32_t COLUMN_USERNAME_SIZE = 32;
const uint32_t COLUMN_EMAIL_SIZE = 255;
struct Row_t {
  uint32_t id;
  // C Strings are null terminated.  Need an extra byte for that.
  char username[COLUMN_USERNAME_SIZE + 1];
  char email[COLUMN_EMAIL_SIZE + 1];
};

typedef struct Row_t Row;
typedef struct InputBuffer_t InputBuffer;

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

// prepared statement
enum StatementType_t { STATEMENT_INSERT, STATEMENT_SELECT };
typedef enum StatementType_t StatementType;

struct Statement_t {
    StatementType type;
    Row row_to_insert; // used for insert statements
};

typedef struct Statement_t Statement;

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

struct Cursor_t {
  Table* table;
  uint32_t row_num;
  bool end_of_table; // represents 1 past where we have data
};
typedef struct Cursor_t Cursor;

enum NodeType_t { NODE_INTERNAL, NODE_LEAF };
typedef enum NodeType_t NodeType;

// Common Node Header
const uint32_t NODE_TYPE_SIZE = sizeof(uint8_t);
const uint32_t NODE_TYPE_OFFSET = 0;
const uint32_t IS_ROOT_SIZE = sizeof(uint8_t);
const uint32_t IS_ROOT_OFFSET = NODE_TYPE_SIZE;
const uint32_t PARENT_POINTER_OFFSET = IS_ROOT_OFFSET + IS_ROOT_SIZE;
const uint8_t COMMON_NODE_HEADER_SIZE = NODE_TYPE_SIZE + IS_ROOT_SIZE + PARENT_POINTER_OFFSET;

// Leaf Node Header
const uint32_t LEAF_NODE_NUM_CELLS_SIZE = sizeof(uint32_t);
const uint32_t LEAF_NODE_NUM_CELLS_OFFSET = COMMON_NODE_HEADER_SIZE;
const uint32_t LEAF_NODE_HEADER_SIZE = COMMON_NODE_HEADER_SIZE + LEAF_NODE_NUM_CELLS_SIZE;

// Leaf Body
const unint32_t LEAF_NODE_KEY_SIZE = sizeof(uint32_t);
const unint32_t LEAF_NODE_KEY_OFFSET = 0;
const unint32_t LEAF_NODE_VALUE_SIZE = ROW_SIZE;
const unint32_t LEAF_NODE_VALUE_OFFSET = LEAF_NODE_KEY_OFFSET + LEAF_NODE_KEY_SIZE;
const unint32_t LEAF_NODE_CELL_SIZE = LEAF_NODE_KEY_SIZE + LEAF_NODE_VALUE_SIZE;
const unint32_t LEAF_NODE_SPACE_FOR_CELLS = PAGE_SIZE - LEAF_NODE_HEADER_SIZE;
const unint32_t LEAF_NODE_MAX_CELLS = LEAF_NODE_SPACE_FOR_CELLS / LEAF_NODE_CELL_SIZE;

#endif //LEARNING_REPL_H
