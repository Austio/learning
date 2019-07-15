#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

int BUFFER_SIZE = 10000;
char END_DELIM = ']';

struct StringDecompression {
  int i;
  char* copyToBuffer;
  char* compressed;
};

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

struct StringDecompression decompressString(struct StringDecompression s) {
  int delim_iterations, seq_start, seq_end = 0;

  while(s.compressed[s.i] != 0) {
    if (isdigit(s.compressed[s.i])) {
      delim_iterations = ctoi(s.compressed[s.i]);

      // 3[sequence], i is currently the number so we skip over that and the [
      s.i = s.i + 2;
      seq_start = s.i;

      while(s.compressed[s.i] != END_DELIM) { s.i++; }
      seq_end = s.i - 1;

       while (delim_iterations > 0) {
         concatString(s.copyToBuffer, s.compressed, seq_start, seq_end);
         delim_iterations--;
       }

    } else {
      concatString(s.copyToBuffer, s.compressed, s.i, s.i);
    }

    s.i++;
  }

  return s;
}


int main(int argc, char* argv[]) {
  if (argc < 2) {
    printf("Must supply a decompression string.\n");
    exit(EXIT_FAILURE);
  }
  char* s = argv[1];
  char d[100000];

  struct StringDecompression stringDecompression = {
    .i = 0,
    .copyToBuffer = d,
    .compressed = s
  };

  printf("%s", decompressString(stringDecompression).copyToBuffer);

  exit(0);
}