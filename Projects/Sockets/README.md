### [Sockets](http://www.cs.rpi.edu/~moorthy/Courses/os98/Pgms/socket.html)

#### Setup

```
gcc -o server server.c
gcc -o client client.c

./server 51717
./client localhost 51717
```


[Source](http://www.cs.rpi.edu/~moorthy/Courses/os98/Pgms/socket.html "Permalink to Sockets Tutorial")

# Sockets Tutorial

## Sockets Tutorial

This is a simple tutorial on using sockets for interprocess communication.

### The client server model

##  by Robert Ingalls

Most interprocess communication uses the _client server model_. These terms refer to the two processes which will be communicating with each other. One of the two processes, the _client_, connects to the other process, the _server_, typically to make a request for information. A good analogy is a person who makes a phone call to another person.

Notice that the client needs to know of the existence of and the address of the server, but the server does not need to know the address of (or even the existence of) the client prior to the connection being established. Notice also that once a connection is established, both sides can send and receive information.

The system calls for establishing a connection are somewhat different for the client and the server, but both involve the basic construct of a _socket_. A socket is one end of an interprocess communication channel. The two processes each establish their own socket.

The steps involved in establishing a socket on the _client_ side are as follows:

1. Create a socket with the `socket()` system call
2. Connect the socket to the address of the server using the `connect()` system call
3. Send and receive data. There are a number of ways to do this, but the simplest is to use the `read()` and `write() ` system calls.
The steps involved in establishing a socket on the _server_ side are as follows:

1. Create a socket with the `socket()` system call
2. Bind the socket to an address using the `bind()` system call. For a server socket on the Internet, an address consists of a port number on the host machine.
3. Listen for connections with the `listen()` system call
4. Accept a connection with the `accept()` system call. This call typically blocks until a client connects with the server.
5. Send and receive data

### Socket Types

When a socket is created, the program has to specify the _ address domain_ and the _ socket type_. Two processes can communicate with each other only if their sockets are of the same type and in the same domain. There are two widely used address domains, the _unix domain_, in which two processes which share a common file system communicate, and the _Internet domain_, in which two processes running on any two hosts on the Internet communicate. Each of these has its own address format.

The address of a socket in the Unix domain is a character string which is basically an entry in the file system.

The address of a socket in the Internet domain consists of the Internet address of the host machine (every computer on the Internet has a unique 32 bit address, often referred to as its IP address). In addition, each socket needs a port number on that host. Port numbers are 16 bit unsigned integers. The lower numbers are reserved in Unix for standard services. For example, the port number for the FTP server is 21. It is important that standard services be at the same port on all computers so that clients will know their addresses. However, port numbers above 2000 are generally available.

There are two widely used socket types, _stream sockets_, and _datagram sockets_. Stream sockets treat communications as a continuous stream of characters, while datagram sockets have to read entire messages at once. Each uses its own communciations protocol. Stream sockets use TCP (Transmission Control Protocol), which is a reliable, stream oriented protocol, and datagram sockets use UDP (Unix Datagram Protocol), which is unreliable and message oriented.

The examples in this tutorial will use sockets in the Internet domain using the TCP protocol.

###  Sample code

C code for a very simple client and server are provided for you. These communicate using stream sockets in the Internet domain. The code is described in detail below. However, before you read the descriptions and look at the code, you should compile and run the two programs to see what they do.

![][1][ Click here for the server program ][2]

![][1][ Click here for the client program ][3]

Download these into files called `server.c` and ` client.c` and compile them separately into two executables called `server` and `client`. They require special compiling flags as stated in their respective progarms.

Ideally, you should run the client and the server on separate hosts on the Internet. Start the server first. Suppose the server is running on a machine called `cheerios`. When you run the server, you need to pass the port number in as an argument. You can choose any number between 2000 and 65535. If this port is already in use on that machine, the server will tell you this and exit. If this happens, just choose another port and try again. If the port is available, the server will block until it receives a connection from the client. Don't be alarmed if the server doesn't do anything; it's not supposed to do anything until a connection is made. Here is a typical command line:


    server 51717


To run the client you need to pass in two arguments, the name of the host on which the server is running and the port number on which the server is listening for connections. Here is the command line to connect to the server described above:


    client cheerios 51717


The client will prompt you to enter a message. If everything works correctly, the server will display your message on stdout, send an acknowledgement message to the client and terminate. The client will print the acknowledgement message from the server and then terminate.

You can simulate this on a single machine by running the server in one window and the client in another. In this case, you can use the keyword `localhost` as the first argument to the client.

#### Server code

The server code uses a number of ugly programming constructs, and so we will go through it line by line.

* * *

` #include <stdio.h>` This header file contains declarations used in most input and output and is typically included in all C programs.

* * *

` #include <sys/types.h>` This header file contains definitions of a number of data types used in system calls. These types are used in the next two include files.

* * *

` #include <sys/socket.h>` The header file [ `socket.h` ][4] includes a number of definitions of structures needed for sockets.

* * *

` #include <netinet/in.h>` The header file [`netinet/in.h`][5] contains constants and structures needed for internet domain addresses.

* * *


    void error(char *msg)
    {
        perror(msg);
        exit(1);
    }


This function is called when a system call fails. It displays a message about the error on `stderr` and then aborts the program. ![][1][ Click here ][6] to see the man page for `perror()`

* * *


    int main(int argc, char *argv[])
    {
         int sockfd, newsockfd, portno, clilen, n;


`sockfd` and `newsockfd` are file descriptors, i.e. array subscripts into the [file descriptor table ][7]. These two variables store the values returned by the socket system call and the accept system call.

`portno` stores the port number on which the server accepts connections.

`clilen` stores the size of the address of the client. This is needed for the accept system call.

`n` is the return value for the `read()` and `write()` calls; i.e. it contains the number of characters read or written.

* * *


         char buffer[256];


The server reads characters from the socket connection into this buffer.

* * *


         struct sockaddr_in serv_addr, cli_addr;


A `sockaddr_in` is a structure containing an internet address. This structure is defined in `<netinet/in.h>`. Here is the definition:


    struct sockaddr_in {
            short   sin_family;
            u_short sin_port;
            struct  in_addr sin_addr;
            char    sin_zero[8];
    };


An `in_addr` structure, defined in the same header file, contains only one field, a unsigned long called `s_addr`. The variable `serv_addr` will contain the address of the server, and `cli_addr` will contain the address of the client which connects to the server.

* * *


         if (argc
    The user needs to pass in the port number on which the server will
    accept connections as an argument.  This code displays an error
    message if the user fails to do this.


    * * *


         sockfd = socket(AF_INET, SOCK_STREAM, 0);
         if (sockfd
    The socket() system call creates a new socket.  It takes
    three arguments.  The first is the address domain of the socket.
    Recall that there are two possible address domains, the unix domain
    for two processes which share a common file system, and the Internet
    domain for any two hosts on the Internet.  The symbol constant
    AF_UNIX is used for the former, and AF_INET
    for the latter (there are actually many other options which can be
    used here for specialized purposes).



    The second argument is the type of socket.  Recall that there
    are two choices here, a stream socket in which characters are read
    in a continuous stream as if from a file or pipe, and a
    datagram socket, in which messages are read in chunks.
    The two symbolic constants are SOCK_STREAM and
    SOCK_DGRAM.

    The third argument is the protocol. If this argument is zero
    (and it always should be except for unusual circumstances), the
    operating system will choose the most appropriate protocol.
    It will choose TCP for stream sockets and UDP for datagram sockets.



    The socket system call returns an entry into the file descriptor
    table (i.e. a small integer).  This value is used for all subsequent
    references to this socket. If the socket call fails, it returns -1.
    In this case the program displays and error message and exits.  However,
    this system call is unlikely to fail.



    This is a simplified description of the socket call; there are
    numerous other choices for domains and types, but these are the most
    common. [ ![][1] Click here ][8] to see the socket man page.


    * * *


         bzero((char *) &serv_addr, sizeof(serv_addr));


The function `bzero()` sets all values in a buffer to zero. It takes two arguments, the first is a pointer to the buffer and the second is the size of the buffer. Thus, this line initializes `serv_addr` to zeros.

* * *


         portno = atoi(argv[1]);


The port number on which the server will listen for connections is passed in as an argument, and this statement uses the ` atoi()` function to convert this from a string of digits to an integer.

* * *


         serv_addr.sin_family = AF_INET;


The variable `serv_addr` is a structure of type `struct sockaddr_in`. This structure has four fields. The first field is `short sin_family`, which contains a code for the address family. It should always be set to the symbolic constant `AF_INET`.

* * *


         serv_addr.sin_port = htons(portno);


The second field of `serv_addr` is `unsigned short sin_port `, which contain the port number. However, instead of simply copying the port number to this field, it is necessary to convert this to [network byte order ][9] using the function ` htons()` which converts a port number in host byte order to a port number in network byte order.

* * *


         serv_addr.sin_addr.s_addr = INADDR_ANY;


The third field of `sockaddr_in` is a structure of type `struct in_addr` which contains only a single field `unsigned long s_addr`. This field contains the IP address of the host. For server code, this will always be the IP address of the machine on which the server is running, and there is a symbolic constant `INADDR_ANY` which gets this address.

* * *


         if (bind(sockfd, (struct sockaddr *) &serv_addr,
                  sizeof(serv_addr))
    The bind() system call binds a socket to an
    address, in this case the address of the current host and
    port number on which the server will run.  It takes three
    arguments, the socket file descriptor, the address to which
    is bound, and the size of the address to which it is bound.
    The second argument is a pointer to a structure of type
    sockaddr, but what is passed in is a structure
    of type sockaddr_in, and so this must be cast to
    the correct type.  This can fail for a number of reasons, the
    most obvious being that this socket is already in use on this
    machine.  [ ![][1] Click here ][10] to see the man page
    for bind()


    * * *


         listen(sockfd,5);


The `listen` system call allows the process to listen on the socket for connections. The first argument is the socket file descriptor, and the second is the size of the backlog queue, i.e., the number of connections that can be waiting while the process is handling a particular connection. This should be set to 5, the maximum size permitted by most systems. If the first argument is a valid socket, this call cannot fail, and so the code doesn't check for errors. [ ![][1] Click here ][11] to see the man page for listen.

* * *


         clilen = sizeof(cli_addr);
         newsockfd = accept(sockfd, (struct sockaddr *) &cli_addr, &clilen);
         if (newsockfd
    The accept() system call causes the process to
    block until a client connects to the server.  Thus, it wakes up
    the process when a connection from a client has been successfully
    established.  It returns a new file descriptor, and all communication
    on this connection should be done using the new file descriptor.
    The second argument is a reference pointer to the address of the
    client on the other end of the connection, and the third argument is
    the size of this structure.


    * * *


         bzero(buffer,256);
         n = read(newsockfd,buffer,255);
         if (n
    Note that we would only get to this point after a client has
    successfully connected to our server.  This code initializes the
    buffer using the bzero() function, and then reads from
    the socket.  Note that the read call uses the new file descriptor, the
    one returned by accept(), not the original file descriptor
    returned by socket().  Note also that the read()
     will block until there is something for it to read in the
    socket, i.e. after the client has executed a write().
    It will read either the total number of characters in the socket or
    255, whichever is less, and return the number of characters read.
    [ ![][1] Click here][12] to see
    the man page for  read().


    * * *


         n = write(newsockfd,"I got your message",18);
         if (n
    Once a connection has been established, both ends can both read and
    write to the connection.  Naturally, everything written by the client
    will be read by the server, and everything written by the server
    will be read by the client.  This code simply writes a short
    message to the client.  The last argument of write is the size of the
    message. [ ![][1] Click here ][13] to see the man page
    for write.


    * * *


         return 0;
    }


This terminates main and thus the program. Since main was declared to be of type int as specified by the ascii standard, many compilers complain if it does not return anything.

###  Client code

As before, we will go through the program `client.c` line by line.


    #include <stdio.h>
    #include <sys/types.h>
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <netdb.h>


The header files are the same as for the server with one addition. The file `netdb.h` defines the structure ` hostent`, which will be used below.

* * *


    void error(char *msg)
    {
        perror(msg);
        exit(0);
    }

    int main(int argc, char *argv[])
    {
        int sockfd, portno, n;
        struct sockaddr_in serv_addr;
        struct hostent *server;


The `error()` function is identical to that in the server, as are the variables `sockfd, portno`, and `n`. The variable `serv_addr` will contain the address of the server to which we want to connect. It is of type [ `struct sockaddr_in`][14].

The variable `server` is a pointer to a structure of type `hostent`. This structure is defined in the header file `netdb.h` as follows:


    struct  hostent {
            char    *h_name;        /* official name of host */
            char    **h_aliases;    /* alias list */
            int     h_addrtype;     /* host address type */
            int     h_length;       /* length of address */
            char    **h_addr_list;  /* list of addresses from name server */
    #define h_addr  h_addr_list[0]  /* address, for backward compatiblity */
    };


It defines a host computer on the Internet. The members of this structure are:


    h_name       Official name of the host.

    h_aliases    A zero  terminated  array  of  alternate
                 names for the host.

    h_addrtype   The  type  of  address  being  returned;
                 currently always AF_INET.

    h_length     The length, in bytes, of the address.

    h_addr_list  A pointer to a list of network addresses
                 for the named host.  Host addresses are
                 returned in network byte order.


Note that `h_addr` is an alias for the first address in the array of network addresses.

* * *


        char buffer[256];
        if (argc
    All of this code is the same as that in the server.


    * * *


        server = gethostbyname(argv[1]);
        if (server == NULL) {
            fprintf(stderr,"ERROR, no such hostn");
            exit(0);
        }


`argv[1]` contains the name of a host on the Internet, e.g. `cheerios@cs.rpi.edu`. The function:


         struct hostent *gethostbyname(char *name)


Takes such a name as an argument and returns a pointer to a `hostent` containing information about that host. The field `char *h_addr` contains the IP address. If this structure is NULL, the system could not locate a host with this name.

The mechanism by which this function works is complex, often involves querying large databases all around the country.

* * *


        bzero((char *) &serv_addr, sizeof(serv_addr));
        serv_addr.sin_family = AF_INET;
        bcopy((char *)server->h_addr,
             (char *)&serv_addr.sin_addr.s_addr,
             server->h_length);
        serv_addr.sin_port = htons(portno);


This code sets the fields in `serv_addr`. Much of it is the same as in the server. However, because the field `server->h_addr` is a character string, we use the function:


    void bcopy(char *s1, char *s2, int length)


which copies `length` bytes from `s1` to `s2`.

* * *


        if (connect(sockfd,&serv_addr,sizeof(serv_addr))
    The connect function is called by the client
    to establish a connection to the server.  It takes three
    arguments, the socket file descriptor, the address of the
    host to which it wants to connect (including the port number), and
    the size of this address.  This function returns 0 on success
    and -1 if it fails. [ ![][1] Click here ][15] to
    see the man page for connect.



    Notice that the client needs to
    know the port number of the server, but it does not need to know
    its own port number.  This is typically assigned by the system when
    connect is called.


    * * *


        printf("Please enter the message: ");
        bzero(buffer,256);
        fgets(buffer,255,stdin);
        n = write(sockfd,buffer,strlen(buffer));
        if (n
    The remaining code should be fairly clear.  It prompts the
    user to enter a message, uses fgets to read the
    message from stdin, writes the message to the socket, reads
    the reply from the socket, and displays this reply on the screen.



    ##  Enhancements to the server code



    The sample server code above has the limitation that it only handles
    one connection, and then dies.  A "real world" server should run
    indefinitely and should have the capability of handling a number of
    simultaneous connections, each in its own process.  This is typically
    done by forking off a new process to handle each new connection.



    The
    following code has a dummy function called dostuff(int sockfd).
    This function will handle the connection after it has been established
    and provide whatever services the client requests.  As we saw above,
    once a connection is established, both ends can use read
    and write to send information to the other end, and the
    details of the information passed back and forth do not concern us here.
    To write a "real world" server, you would make essentially no changes
    to the main() function, and all of the code which provided the service would
    be in dostuff().



    To allow the server to handle multiple simultaneous connections,
    we make the following changes to the code:


    1.  Put the accept statement and the following code in an infinite loop.

    2.  After a connection is established, call fork() to
    create a new process.

    3.  The child process will close sockfd and call
    dostuff, passing the new socket file descriptor
    as an argument.  When the two processes have completed their
    conversation, as indicated by dostuff() returning,
    this process simply exits.

    4.  The parent process closes newsockfd.  Because
    all of this code is in an infinite loop, it will return to the
    accept statement to wait for the next connection.


    Here is the code.



     while (1) {
         newsockfd = accept(sockfd,
               (struct sockaddr *) &cli_addr, &clilen);
         if (newsockfd

    ![][1][ Click here ][16] for
    a complete server program which includes this change.  This
    will run with the program client.c.



    ###  Alternative types of sockets



    This example showed a stream socket in the Internet domain.  This is the
    most common type of connection.  A second type of connection is a
    datagram socket.  You might want to use a datagram socket in cases
    where there is only one message being sent from the client to the
    server, and only one message being sent back.
    There are several differences between a datagram socket and
    a stream socket.


    1.  Datagrams are unreliable,
    which means that if a packet of information gets lost somewhere in the
    Internet, the sender is not told (and of course the receiver does not
    know about the existence of the message).  In contrast, with a stream socket,
    the underlying TCP protocol will detect that a message was lost because
    it was not acknowledged, and it will be retransmitted without
    the process at either end knowing about this.

    2.  Message boundaries are preserved in datagram sockets.
    If the sender sends a datagram of 100
    bytes, the receiver must read all 100 bytes at once.  This can be
    contrasted with a stream socket, where if the sender wrote a 100
    byte message, the receiver could read it in two chunks of 50 bytes
    or 100 chunks of one byte.

    3.  The communication is done using special system calls
    sendto() and receivefrom() rather than the more
    generic read() and write().

    4.  There is a lot less overhead associated with a datagram socket
    because connections do not need to be established and broken down,
    and packets do not need to be acknowledged.  This is why datagram
    sockets are often used when the service to be provided is short,
    such as a time-of-day service.


    ###  Server code with a datagram socket

    ![][17]

[1]: http://www.cs.rpi.edu/redball.gif
[2]: http://www.cs.rpi.edu/server.c
[3]: http://www.cs.rpi.edu/client.c
[4]: http://www.cs.rpi.edu/socket.h
[5]: http://www.cs.rpi.edu/in.h
[6]: http://www.cs.rpi.edu/perror.txt
[7]: http://www.cs.rpi.edu/fd.txt
[8]: http://www.cs.rpi.edu/socket.txt
[9]: http://www.cs.rpi.edu/byteorder.txt
[10]: http://www.cs.rpi.edu/bind.txt
[11]: http://www.cs.rpi.edu/listen.txt
[12]: http://www.cs.rpi.edu/read.txt
[13]: http://www.cs.rpi.edu/write.txt
[14]: http://www.cs.rpi.edu/sockaddr
[15]: http://www.cs.rpi.edu/connect.txt
[16]: http://www.cs.rpi.edu/server2.c
[17]: http://www.cs.rpi.edu/at_work.gif


