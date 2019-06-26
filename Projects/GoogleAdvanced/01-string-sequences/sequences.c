#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//char * function concatString(a *string, b *string) {
//  int length = string_length(&a) + string_length(&b) + 1;
//  char out[length] = "";
//  strcat(out, &a)
//}
//
//char * function expandString(s string) {
//}

int main(int argc, char* argv[]) {
  if (argc < 2) {
    printf("Must supply a decompression string.\n");
    exit(EXIT_FAILURE);
  }
  char* s = argv[1];

  char decompressed = char[];

  printf("%s", s);

  exit(0);
}