#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

int BUFFER_SIZE = 10000;
char END_DELIM = ']';

// https://stackoverflow.com/questions/2606539/snprintf-vs-strcpy-etc-in-c
//https://www.joelonsoftware.com/2001/12/11/back-to-basics/
char* concatString(char* copyTo,  char* b, int from, int to) {
  while (from <= to) {
    snprintf(copyTo, BUFFER_SIZE, "%s%c", copyTo, b[from]);
    from++;
  }

  return copyTo;
}

// convert character to integer
// https://stackoverflow.com/questions/628761/convert-a-character-digit-to-the-corresponding-integer-in-c
int ctoi(char c) {
  return c - '0';
}

int main(int argc, char* argv[]) {
  if (argc < 2) {
    printf("Must supply a decompression string.\n");
    exit(EXIT_FAILURE);
  }
  char* s = argv[1];

  // yep lets start with something stupidly static
  char decompressed[100000];

  int i, delim_iterations, seq_start, seq_end = 0;
  while(s[i] != 0) {
    if (isdigit(s[i])) {
      delim_iterations = ctoi(s[i]);

      // 3[sequence], i is currently the number so we skip over that and the [
      i = i + 2;
      seq_start = i;

      while(s[i] != END_DELIM) { i++; }
      seq_end = i - 1;


       while (delim_iterations > 0) {
         concatString(decompressed, s, seq_start, seq_end);
         delim_iterations--;
       }

    } else {
      concatString(decompressed, s, i, i);
    }

    i++;
  }

  printf("%s", decompressed);

  exit(0);
}