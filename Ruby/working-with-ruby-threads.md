### Working with Ruby Threads

Understand how ruby can take advantage of multiple CPU cores.

#### Definitions

 - Process: Program in memory, has register,counter,stack, heap and code
 - Thread: Unit of execution in a process
 
#### Chapter 1 - Always in a thread
By default there is always 1 thread, the main one.  In ruby when this exits all children threads exit.

```rb
Thread.main
Thread.current
[Thread.new, Thread.new].join #blocks until all threads exit
 
Thread.new { Thread.current == Thread.main }.value
=> false

# start of program
thread = Thread.new { "do lots of work" }

# Have to sleep to prevent main thread from exiting, which could cause child to exit
sleep
```

### Chapter 2 - Threads of Execution

Threads have shared address space: AST (compiled ruby code) and Memory (variables) 

Anything that has a multistep assignment is not thread safe: ||=, Arrays

Ruby Threads map to native threads, threads can be paused and restarted at any time by the OS to ensure fair execution, so we have no way to ensure contiguous flow of execution

Example below fails in this way with two files
 - File 1 creates thread A
 - File 2 creates thread B
 - thread A calls results, begins to look for @results as part of ||=, creates new array, before assignment is paused
 - thread B calls results, begins to look for @results as part of ||=, creates new array and assigns then finishes, @results is [File 2 results]
 - thread A wakes up and finishes assignment then finishes, @results is overwritted to [File 1 results]
 - *boom* we just lost File 2 results

Fix here is to initialize @results eagerly in initialize, not lazily so that we don't have the lookup
```rb
require 'thread'
require 'uploader'
class Upload
  def call(files)
    threads = []
    
    files.each do |f|
      threads = Thread.new do 
        results << Uploader.new(thread)
      end  
    end
    
    threads.join
  end

  def results
    @results ||= []
  end
end
```

Any time that two threads can modify the same data, you can have trouble