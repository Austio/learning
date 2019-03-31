/* A simple server in the internet domain using TCP
   The port number is passed as an argument */

#include <stdio.h> // declarations using in most in/out
#include <sys/types.h> // datatypes and system calls
#include <sys/socket.h> // definitions for socket structures
#include <netinet/in.h> // defs for internet domain addresses

void error(char *msg)
{
    perror(msg);
    exit(1);
}

int main(int argc, char *argv[])
{
     int sockfd, newsockfd, portno, clilen;
     char buffer[256];
     struct sockaddr_in serv_addr, cli_addr;
     int n;
     if (argc < 2) {
         fprintf(stderr,"ERROR, no port provided\n");
         exit(1);
     }

     // Creates a new socket for internet and tcp, error if the return isn't a file descriptor (< 0)
     sockfd = socket(AF_INET, SOCK_STREAM, 0);
     if (sockfd < 0) 
        error("ERROR opening socket");

     // bzero zeros out a buffer.  takes pointer and size of the erase
     bzero((char *) &serv_addr, sizeof(serv_addr));

     // atom to integer of what was passed in from command line
     portno = atoi(argv[1]);

     // put values in our struct for type of port, address
     serv_addr.sin_family = AF_INET;
     serv_addr.sin_addr.s_addr = INADDR_ANY;
     serv_addr.sin_port = htons(portno);

     // bind the socket to the address struct
     if (bind(sockfd, (struct sockaddr *) &serv_addr,
              sizeof(serv_addr)) < 0)
              error("ERROR on binding");

     // allows the process to listen on the socket for connections.  5 here is the backlog queue
     // the number of connections that can be waiting while the process is handling a connection
     listen(sockfd,5);

     // accept blocks until a client connects.  When a client establishes it wakes up
     clilen = sizeof(cli_addr);
     newsockfd = accept(sockfd, (struct sockaddr *) &cli_addr, &clilen);
     if (newsockfd < 0) 
          error("ERROR on accept");

     // clear our buffer and read the first 255 characters from the socket, read blocks until data arrives
     bzero(buffer,256);
     n = read(newsockfd,buffer,255);
     if (n < 0) error("ERROR reading from socket");
     printf("Here is the message: %s\n",buffer);

     // write data to the client
     n = write(newsockfd,"I got your message",18);
     if (n < 0) error("ERROR writing to socket");
     return 0; 
}
