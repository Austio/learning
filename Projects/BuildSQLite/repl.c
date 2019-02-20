//
// Created by Austin Story on 2019-02-20.
//

#include "repl.h"
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

void print_prompt() { printf("db > "); }

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

        if (strcmp(input_buffer->buffer, ".exit") == 0) {
            exit(EXIT_SUCCESS);
        } else {
            printf("Unrecognized command '%s.\n", input_buffer -> buffer);
        }
    }
}
