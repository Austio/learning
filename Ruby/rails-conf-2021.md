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

### The Curious Case of the Bad Clone

Sorbet is kind of like this

```
module Toy
  module Sig 
    @last_sig_block = nil
    def sig(&block)
      @last_sig_block = block
    end
    
    def method_added(name)
      return unless @last_sig_block
      
      method_instance = self.instance_method(name)
      sig_block = @last_sig_block
      @last_sig_block = nil 
      
      define_method(name) do |*args, **kwargs, &blk|
        puts "\n Calling #{name}"
        
        signature = sig_block.call
        puts "-> args: #{args.inspect}"
        puts "-> kwargs: #{kwargs.inspect}"
        puts "-> blok: #{blk.inspect}"
        
        return_value = method_instance.bind(self).call(*args, **kwargs, &blk)
        puts "-> return_value: #{return_value.inspect}"
        
        return_value
      end
    end
  end
end

class ToyShop
  extend Toy::Sig
  
  sig { puts "Signature Added" }
  def initialize(name, draft: false)
    @name = name
    @draft = false
  end
  
  sig { puts "Withing!" }
  def with
    yield
  end
  
  def update
    puts "updated"
  end
end

a = ToyShop.new("TMNT")
a.with { puts "HI" }
a.update
```

rails runner -> Will execute something in rails console and exit!
EAGER_LOAD=1 -> Run in prod equivalent
DISABLE_SPRING=1 

pry - backtrace -> Give me the current call stack

All Rails gems have a guides/bug_report_templates/*rb to enable minimal self reproduction

- To track down weird allocations
Neat trick `require "objspace"`
  
ObjectSpace.trace_object_allocations do 
  # Things you want to trace
  shop = Shop.first
  ObjectSpace.allocation_sourcefile(shop.singleton_class)
end

### Engineering MBA

https://kevinjmurphy.com/posts/engineering-mba/

- Leadership
 - Directing: Detailed Supervision - Sets steps, team follows, provide close, detailed supervision with clear instructions and expectations.
 - Coaching: Explains Why - Leader provides feedback and sets direction, but group provides input, focus on getting buy-in from the team on explaining why decisions are made the way they are.
 - Supporting: Facilitates Decision Making - Team makes decision, leader facilitates conversations, shift decision-making ownership to the team and facilitate. discussion amongst the team to reach decisions and provide encouragement.
 - Delegating: Focus on Vision - Team full autonomy, doesn't check out but gets out of way, focus on overall vision, trusting the team with automony on day-to-day decision-making.

Task Behavior -> if people don

|Relationship Support|||
|---|---|---|---|
|High|Supporting, facilitates context once they know the task and how to do it, help them navigate policital, make sure feeling good|Coaching, let them social context how and why, after they know the task that needs to happen||
|Low|Delegating, get out of peoples way when they know what and why|Directing, people don't know what to do,tell them what needs to happen||
||Low|High|Task Behavior Knowledge|

Order is like this
 - Directing (tell them what)
   - Unfamiliar, Clearly defined set of instructions on what needs to happen, someone to help
 - Coaching (What and Why)
   - Familiar, Include prior work, something they have done before, 
 - Supporting (They know what, still need why)   
   - Very Familiar, quick chat with stakeholders to be sure on same page
 - Delegating
   - This Again?  Get in and execute, bring someone else in to learn 
    
 - Competitive Advantage

Should we build something?
 - *Cost*: Cheapest by either being More Efficient, Proprietary Tech, Special access to material
   - Jeweler that has a goldmine
 - *Differentiation*: Uniquely meed needs through High Quality, Innovative Products, Faster Delivery, Better Marketing
 - *Focus*: Tailored Niche, Narrowly Tailored, Caters to Specific Customers, Serves Segment Specifically

What's Best, it depends, what is your competency, you must 
 - Provides access to various markets
 - Contributes to perceived customer benefit
 - Difficult for competitors to immitate

Should we build something? * IS IT A CORE COMPETENCY * 
 - Comment Moderation for HIPAA Comments - Build it, this is an advantage
 - Sending Email about Comments - Pay another company to send email
 - Paginating Comments - Open source library for paginating

- Process Management
Design: 
   - Write down your current process, orders, customers, etc
   - Propose change that coule be better
Model: Expose design to constraints and questions, understand impact
Execute: Prototype, interviews
Monitor: Key Indicators, is it working (cycle time, defect rate)
Optimize: ID New bottlenecks and area of focus     
  
Automating a Mess yields an Automated Mess, Business Process Reengineering
 - Rewriting process, ignore and question current process
 - Reengineering should be focused more on People 

What you do should build value, consider consequences of all people
