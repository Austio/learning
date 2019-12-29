### Digging Into Node

### Review
 - What is the history of node
   - Ryan Dhal was experimenting with creating fast microservices, arrived at js after needing an event loop in ruby
 -  
 
### Concepts
 - Node is really a great wrapper for async programming and stdin/stdout/stderr
 
 
### Scripting
[Arg Processing Package](https://www.npmjs.com/package/minimist)
In a script file you can put
```
!# /usr/bin/env node
// !# tells bash to send it to a program
// /usr/bin/env allows system to find the program
``` 

process.argv = ARGV
  
### Stream
[Great Resource](https://github.com/substack/stream-handbook)

 - Readable Stream responds to pipe
 - Writable Stream accepts a readable stream
 - piping returns a readable stream 

```
readableStream;
writableStream;

anotherReadable = readableStream.pipe(writableStream);  
```