### What the Fork

`fork` - creates a child process
 - duplicates current process, new process is child old process is parent
 - child memory is copy on write for the parent
 - child inherits file descriptors of the parent

`exec` - executes a file (execv).  Replaces the current process image with a new process image.  There shall be no return from successful exec.  Calling process is overlaid by the new process image. 

`wait` - suspends operations of the calling thread until one of children terminates
 - zombie processes - child process that terminates but had no await, kernel maintaines these in the process table, which can not spawn new processes when full.  If a parent process terminates, it's "zombie" children are adopten by init(1)

The reason that Forked processes write to the parents std in/out/err is that they share the same file descriptors!

Fork is used to 
 - Spawn new processes (though use posix_spawn or Process.spawn in ruby to wrap race conditions)
 - Run code in parallel across CPUs.  These are isolated by default and bypasses the GVL, no need for mutexes
 - Copy entire memory address space of a process (this is how redis does background memory saves)

Fork Tips
 - Preload as much as you can before forking, avoid unique things
 - Turn off tranparent huge pages
 - nakoyashi fork to force a GC to optimize on write

Parallel Process tips 
 - Fork 1 process per CPU
 - More processes are good for heavy IO workloads
 - Try Raktors instead of forks when possible (kernel thread but manages separate GVL locks, all objects must be marked as immutable)

Fork Safety 
 - atexit() handlers copied to child from parent, ensure pid equals parent before executing unique logic.  call #exit! to skip handlers in the child
 - Be careful about about shared file descriptors, close sockets after use
 - Background threads are not copied to child on fork

### Who are you.  Delegation, Federation

 - You can trust Math, but not People :)

Can test some things on you own 
 - XSS in tokens
 - Injected token in app that it wasn't expecting
 - What happens if i strip signatures off an otherwise valid token
 - What happens if i give a token intended for a different audience
 - Replay Expired tokens

OIDCDebugger.com
