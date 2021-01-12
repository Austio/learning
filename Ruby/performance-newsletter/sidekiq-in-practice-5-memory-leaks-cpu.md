
Hello Rubyists!

Welcome to the fifth part of my Sidekiq in Practice email series. This email series is intended to be a "missing manual" for running Sidekiq in production, a guide to all the little details of running and scaling our beloved background job framework. I hope you're all finding it useful. I'm really enjoying your comments and questions as well - please do remember that you can reply directly to any of my emails to contact me.

This week's email is about why many apps experience high memory usage, bloat and leaks with Sidekiq.

This email is available as markdown/Github Gist here: https://gist.github.com/nateberkopec/56936904705da5a1fa8e6f74cb08c012

Links to previous emails in this series are at the end.

## Memory Bloat and "Leaks"

I get this one a lot. "My Sidekiq instance uses 14GB of memory!" "My Sidekiq instance has a memory leak, it's growing out of control!" I'm not sure why, but everyone seems to blame Sidekiq first.

I guess it could never be the perfect, 100% bug-free could we're all writing, right?

Well, in reality, most Sidekiq memory issues are caused by **your own code loading too many objects into memory at once** or **caused by the system memory allocator**.

Loading lots of objects at once tends to result in memory "cliffs" - memory usage that was 1GB one minute and 2GB the next, but the memory doesn't go back down. I call this "memory bloat". Allocators can cause long, slow growth over time that many assume to be a memory leak (it isn't). This is memory fragmentation.

Let's talk through each problem in turn, but first: the root cause of both of these issues.

### A Root Issue: Ruby's Memory is Disorganized, and Immovable

A question I get a lot is "why isn't my memory usage going *down*?" You allocate a million objects in a controller action - well, ok, fine, but shouldn't the garbage collector get rid of all of those objects and my memory usage will go back down to what it was before? Most are surprised when memory usage *doesn't* go back down after Jane in Accounting runs a CSV export that loads 10,000 Users into memory at once. This is what we have GC for!

Remember that the Ruby runtime (that most of use) is just a C program. We say we're running Ruby in production, but we're really also running C in production. Many (most) C programs suffer from a critical memory issue: they can't move things around very easily in memory. This is because of a C language feature called pointers. Pointers are just raw virtual memory addresses. Often, C programs pass around these pointers and *expect some data to be there, no matter what*. This is how Ruby's memory management works internally.

C extensions in particular often hold pointers to data in the Ruby heap. If Ruby moved that data somewhere else, you would probably crash Ruby as the data in that memory address wouldn't be what the C extension expected.

So, in general with Ruby, we can't move objects around once they're created. Memory is more or less immovable.

Now, the second characteristic that contributes to these issues is that memory is frequently much more disorganized that we think. For example, consider that CSV action that allocates 10,000 user objects. You may think that's not a problem - even though they're immovable, your virtual memory will just look like 10,000 user objects packed together like sardines, all neat in a row.

Unfortunately, that's not how it works in practice. Creating a single ActiveRecord object is an extremely complex process that involves object allocations on several different layers of abstraction: in the database driver, in Arel, in ActiveRecord itself. There are several *caches* as well in ActiveRecord that are being filled with entires each time your create a new ActiveRecord object. So, far from 10,000 user objects with nothing in between, the total amount of objects created during your 10,000 user export is probably only 5-10% User objects, and there's a bunch of objects in between them. Some of those objects may be active and long-living, such as cache entries.

When it comes to freeing memory, operating systems really need chunks of 4kb or so completely free in order to reclaim that memory from a program. Even one little byte of active memory in a 4kb memory "page" means the program must hold onto that memory.

So, now you're seeing the problem:

1. Ruby's heap is disorganized, and long-lived objects often are allocated right next to ones that won't live through the next GC.
2. Ruby cannot move objects around in the heap.
3. The operating system needs a contiguous 4kb chunk of free memory to reclaim, otherwise the program keeps the memory.

That's a recipe for slow, steady memory growth over time.

Aaron Patterson (GitHub) has been investigating approaches to fixing #1 and #2 for several years now, but it's hard work and is still ongoing.

This week, a blog post from Hongli Lai has added some further understanding to this issue. That post is here: https://www.joyfulbikeshedding.com/blog/2019-03-14-what-causes-ruby-memory-bloat.html

Hongli identified another cause of memory bloat: `malloc` doesn't release space back to the operating system if that free space is in the middle of the heap. `malloc` only releases space back to the kernel if that free space is at the *end* of the heap.

Hongli's patch is interesting, but there's a lot of study yet to be done on that, so I won't get too much further into it here.

This means that the position of the last, live, un-freed memory in your heap is *extremely important*. It also greatly explains why *Ruby's long-term memory usage tends to equal it's maximum instantanteous memory pressure*. That is, in the long run, your Ruby process will use as much memory as it needs to at any possible moment, and it won't tend to use much *less* than that.

Our updated understanding of the problem now looks like this:

1. Ruby's heap is disorganized, and long-lived objects often are allocated right next to ones that won't live through the next GC.
2. Ruby cannot move objects around in the heap.
3. The operating system needs a contiguous 4kb chunk of free memory to reclaim, otherwise the program keeps the memory.
4. The default Linux `malloc` will not release memory back to the OS unless it is at the *end* of the Ruby heap.

Next week, I'll talk about what this understanding of the problem means for our possible solutions.

## Questions/Comments from Last Week (Database Connections)

Remember, you can always reply to this email to send me your own questions and comments.

From Andrew Babichev:

> Some libraries, e.g. globalize, eagerly grabs AR connection in the main (master) thread before Sidekiq spawns worker threads. Particularly, globalize gathers info from translation table during model class load on translates macro/directive/declaration/class method call. Hence it's essential to have +1extra connection in the AR pool for master thread. Of course the is a specific AR extension gem subject (and it's laziness considerations), however people pretty often forget about this kind of problem keeping Sidekiq concurrency exactly equal to AR pool size.

Great point Andrew. If you're getting Connection Timeout errors when Sidekiq concurrency equals AR pool size exactly, this may be happening. Add extra connections to the DB pool until the errors stop - not a big issue.

## Plain text?

I'm wondering if I should switch back *off* of plain-text email to HTML. I switched to plain text originally because I enjoy the privacy it afford you - it's basically impossible for me to track you at all, and if I try to track your link clicks it's very obvious. However, in long-form emails like this the format becomes basically unusable, since email client formatting is pretty bad across the board for readability.

What do you think? HTML email of course doesn't *require* me to track you in any way, but it makes it a little easier. I sort of like the purity of the plaintext format, but if it results in unusable content, then there's no point? 
