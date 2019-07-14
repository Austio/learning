#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

// https://stackoverflow.com/questions/2606539/snprintf-vs-strcpy-etc-in-c
//https://www.joelonsoftware.com/2001/12/11/back-to-basics/
char* concatString(char* a,  char* b, int from, int to) {
  char copy_buffer[1];
  while (from <= to) {
    copy_buffer[0] = b[from];
    snprintf(a, sizeof(a), "%s%c", a, b[from]);
    from++;
  }

  return a;
}

int main(int argc, char* argv[]) {
  if (argc < 2) {
    printf("Must supply a decompression string.\n");
    exit(EXIT_FAILURE);
  }
  char* s = argv[1];

  // yep lets start with something stupidly static
  char decompressed[100000];

  int i, delim_iterations, delim_start, delim_end = 0;
  while(s[i] != 0) {
    if (isdigit(s[i])) {
      delim_start = i + 1;

      while(!strncmp(&s[i], "]", 1)) { i++; }
      delim_end = i;

    } else {
      concatString(decompressed, s, i, i);
    }

    i++;
  }

  printf("%s", decompressed);

  exit(0);
}