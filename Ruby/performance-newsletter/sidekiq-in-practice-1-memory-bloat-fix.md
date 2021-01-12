Hey-o Rubyists!

This is part 6 of my Sidekiq in Practice email series. It's all about running our
beloved background job framework in production; a series of tips, tricks and concepts
that will help you to scale your application on Sidekiq.

This is the follow-up to the previous email in the series about memory. In that email,
we talked about some of the causes of excessive memory usage. In this email, we'll
be talking about the *solutions* to those problems.

This email is available as markdown/Github Gist here: https://gist.github.com/nateberkopec/62e318fdf0a48ed6880fd861b3def55b

Links to previous emails in this series are at the end.

### Memory Bloat: Allocate Less at Once

In the last email, I said:

> 1. Ruby's heap is disorganized, and long-lived objects often are allocated right next to ones that won't live through the next GC.
> 2. Ruby cannot move objects around in the heap.
> 3. The operating system needs a contiguous 4kb chunk of free memory to reclaim, otherwise the program keeps the memory.
> 4. As recently discovered by Hongli Lai, `malloc` only releases space back to the kernel if that free space is at the *end* of the heap.

These four factors lead to Ruby's characteristic memory behavior - long, slow logarithmic growth
over time that *approaches* an asymptotic limit but never quite reaches it.

The four factors of Ruby memory growth are *greatly* aggravated by one common allocation pattern.
This pattern is extremely common in background jobs as well. I think, as I describe it,
you'll immediately think of at least one background job that does this in your application.
Everyone's got one!

The pattern is allocating a massive, massive collection.

You know, that one job that loads all the users from the database before it sends them all an email?
That one. The job that exports a massive CSV file by loading it all into memory first. The one
that loads every company in the database before making a calculation. Literally every codebase I work
on has at least one of these.

They're pretty easy to spot in your production metrics, too. They leave behind a massive "cliff" in memory usage. Before these jobs get run, you're using 256MB of memory. Afterward, 512MB, 1GB, sometimes even worse.

If you're using Scout (https://scoutapp.com/), you can sort your background jobs by "maximum number of allocated objects". **Background jobs that create 1 million or more objects are bad** - you'll need to figure out ways of holding less objects in memory at once to reduce the memory impact of these sorts of jobs. More on the solutions later.

In New Relic, the way I identify these jobs is to first navigate to the memory usage of 1 of my worker instances. Once I've got that graph, I zoom in on one of these memory "cliffs" by clicking and dragging on the graph. This will narrow the time period that New Relic is looking at. I zoom in until I'm looking at only about 10 minutes worth of data. Then, I navigate to the transactions tab and see what jobs ran during this 10 minute timeslice. Usually, theres 1 or 2 which have an extremely long execution time (10 seconds or more). 99% of the time, that's the culprit.

And thanks to the 4 factors I listed above, memory won't be returned to the operating system and memory usage will remain constant after this massive growth, even though all of the objects created have been freed and there's no memory leak.

So, now you know which job is the one that's causing the issue, but how do you know what lines of code are the actual culprits? Well, I go through that process in The Complete Guide to Rails Performance (www.railsspeed.com) but truthfully, most of the time you don't need a full forensic accounting of every allocation. The problem is almost always 1 massive collection. Usually, it's pretty obvious where that is in a job.

90% of the time it's an each loop or an Enumerable call (like map or reduce). It looks like this:

```
User.some_scope.each do 
```

If it's an ActiveRecord collection, one fix is pretty simple - use find_each instead (https://api.rubyonrails.org/classes/ActiveRecord/Batches.html):

```
User.some_scope.find_each do |user|
  user.do_awesome_stuff
end
```

Rather than loading *every* user that matches User.some_scope into memory at once, find_each loads
them in batches of 1000. This drastically cuts down on the maximum memory pressure of these jobs.

The second reason I've seen for high-memory-bloat jobs is accidentally copying a collection.

There are many methods which copy the entire collection before performing an operation on them. They do this because these methods are intended to return a new object rather than modify the existing object. Here are some examples:

```
["a","b","c"].map # copies the array and everything in it 
["a","b","c"].map! # modifies the array IN PLACE 
```

Effectively, the "non-bang" versions of methods have *twice* the memory requirement of a "bang!"
version. This normally isn't a big deal. However, if the collection you're calling it on
is very large, then we could be talking about the difference between 1 million and 2 million
objects!

OK, so the most common ways to fix this are:

1. Reduce the amount of objects you add to a collection at once, usually with something like `find_each`
2. Use `!` versions of methods on large (100k+ object) collections to modify them in-place

And finally, the third thing I'll do is to "fan-out" wherever possible. Fanouts use 2 job classes: one job class is the "organizer", which looks up all the records or items in a collection you need to do work on, and the 2nd job class is the "do-er", which performs the operation for one of those records or collection items.

I love fanouts for a lot of different reasons.

First, they clean up the code a bit. One job has the responsibility to gather up the data. The second job works on just one datum from that dataset. It's a nice division of work. SOLID and all that.

Second, fanouts *embrace the distributed nature of Sidekiq*. Calling `.each` on a 1 million element collection and having your job take 5 minutes to complete is *not distributed computing*. It's also *way way faster*, since the actual work itself is being done in parallel rather than serially.

Third, fanout jobs usually use much less memory than a single-job approach, which is the point of this email :)

## Two Quick Stories

Okay, to close this out, I've got two quick stories about memory bloat that I've gathered along the way in my client work.

One client had a background process that would run for 10+ minutes and grow in memory usage over the course of those 10 minutes. Usually with memory-bloated background jobs, you see a big spike in memory usage as the collection is created, and then memory usage stays constant. Not so here - this job would increase Sidekiq's memory usage by 10 MB a minute!

It turned out that it was iterating over a collection and doing something like this:

```
user = User.first
imported_data = a_big_csv_of_data 
imported_data.each do |user| 
  user.posts.find_or_create_by(imported_data)
end
```

What was happening was that internally, `user.posts` was getting a large Post object added to it during every iteration of the loop. Since `user` and `user.posts` was always in-scope, that huge `user.posts` array couldn't be garbage collected!

Second story. A client had a Sidekiq job that would use massive amounts of memory. We sat down and worked through it using the memory profiling skills I discussed in the CGRP, and discovered something like this:

```
massive_collection.map { ... }
```

There wasn't really anything we could do about `massive_collection` easily - it would have required a pretty big rewrite. But one thing we could do easily was modify the collection in-place with `map!` rather than `map` - problem solved.

## Previous Emails in the Sidekiq-In-Practice Series:

* The Concurrency Settings http://eepurl.com/ghmV81
* Idempotency: Problem http://eepurl.com/gif1KH
* Idempotency: Solution http://eepurl.com/giY8L5
* Database Connections http://eepurl.com/gjXA55
* Memory: Problem http://eepurl.com/gkTHcX