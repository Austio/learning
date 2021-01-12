I'm experimenting with some additional email-only content this year, as a small thank you for subscribing to this list. To start with, I'm doing a many-part series on Sidekiq. This will be based on all the lessons I've learned over the years and applied with my clients.

Most of us are now using Sidekiq to run our background jobs. It's a big step up in throughput from single-threaded job processors, like Resque, and it's a big scalability boost over SQL-backed queues like DelayedJob. However, over the years, Sidekiq has exposed a few problems in the C-Ruby implementation related to threads, specifically around memory and the GVL (Global VM Lock). As a result, we've "learned" a lot about deploying Sidekiq in production since its 1.0 release.

Recently, a few settings in Sidekiq core (as of this writing, at v5.2.5) have changed their default values. I'd like to talk about one of those settings changes, and why I think *everyone*, regardless of Sidekiq version, should backport these changes to their own Sidekiq installs.

## Fragmentation and Concurrency ## 

With Sidekiq 5.2.0, the default concurrency setting was changed from 25 to 10: https://github.com/mperham/sidekiq/commit/8ff96ae0b0358dc273d19ae1f8474f6ff4fd2b64

Why?

One of the most important things we've learned over the years about Sidekiq is that a bad interaction between the C-Ruby runtime and the `malloc` memory allocator included in Linux's glibc can cause extremely high memory usage. I'll talk about what causes this bad interaction in a later email, but for now, let's just concentrate on the effects.

Sidekiq with high concurrency settings, when running on Linux, can have what *looks like* a "memory leak". A single Sidekiq process can slowly grow from 256MB of memory usage to 1GB in less than 24 hours. However, rather than a leak, this is actually memory fragmentation.

Memory fragmentation occurs when a memory space starts to look like swiss cheese: it's got lots of little holes all over the place of odd and strange sizes, and the entire space isn't full. Remember defragmenting your disk in Windows 95? It's exactly like that.

I'm going to share this great Stack answer (https://stackoverflow.com/questions/3770457/what-is-memory-fragmentation) by Steve Jessop because it's got a great ASCII art explanation:

=========================================================

Imagine that you have a "large" (32 bytes) expanse of free memory:

----------------------------------
| |
----------------------------------

Now, allocate some of it (5 allocations):

----------------------------------
|aaaabbccccccddeeee |
----------------------------------

Now, free the first four allocations but not the fifth:

----------------------------------
| eeee |
----------------------------------

Now, try to allocate 16 bytes. Oops, I can't, even though there's nearly double that much free.

=========================================================

What we've learned since Sidekiq became popular is that memory fragmentation becomes much *worse* in a direct relationship with the number of Ruby threads. Sidekiq's "concurrency" setting is just a setting of how many threads it will run at once. High numbers lead to more fragmentation. You could imagine that 1 thread uses log(x) memory over time, so increasing the number of threads leads to n * log(x) memory use. Similarly, Ruby processes which use just one thread (Unicorn, DelayedJob, Resque) don't experience this issue almost at all.

This led to the reduction of the default concurrency setting. But, aren't we losing a lot of throughput and capacity by reducing the total thread count by 60 percent? Will I have to run 3x the amount of Sidekiq processes or servers in production after making this change?!

I'm not so sure. This is where the GVL comes in.

Another thing we've learned in production over the years is just how useful a thread is. You might think of this as "the marginal benefit of adding 1 additional thread". What we're sure of is that there are greatly diminishing returns. The second thread adds more throughput than the third, which adds more throughput than the fourth, and so on. However, at some point, the fragmentation and memory cost of 1 additional thread is greater than the added throughput.

The Global Virtual Machine Lock is an intimidating concept for people, but it's actually quite simple. The clues are in the name. This is a *global lock*, that is, only one thing can hold this lock at a time. What is it a lock around? The Ruby Virtual Machine. So, only one thread in our Ruby processes can run the Ruby virtual machine at a time. In effect, we cannot run Ruby code in parallel. But our threads perform *other work* which is not running Ruby code and does not require the Ruby Virtual Machine. The biggest task in this category is I/O: sending and receiving data, particularly across the network. This is because I/O in CRuby runtime is implemented in C code, not in Ruby.

So, the marginal usefulness of one additional thread with CRuby is actually just proportional to how much of the workload is I/O calls. This intuition is formalized by something called Amdahl's Law (https://en.wikipedia.org/wiki/Amdahl%27s_law), which mathematically relates speedup in work, the amount of processor cores we can take advantage of, and the portion of the work which can be done in parallel.

As already stated, with CRuby, the percentage of the work we can do in parallel is the same thing as the amount of work that is I/O. Many background jobs do quite a bit of I/O: lots of database calls, lots of network calls to external services like your mail server or your credit card processor.

Let's say the average background job spends 75% of it's time in I/O. According to Amdahl's Law (https://en.wikipedia.org/wiki/Amdahl%27s_law#/media/File:AmdahlsLaw.svg), we can expect about a 3x speedup with 8 threads and 8 processors. After that 8th thread, the benefits become quite marginal.

What you'll also notice here is that if you're doing an extremely high amount of I/O in your Sidekiq jobs (90-95% I/O), high thread settings may still be useful to you. If all of your Sidekiq jobs spend 950 milliseconds waiting on a network call from Mailchimp and 50 milliseconds running Ruby code, thread counts as high as 128 may be useful to you. Memory fragmentation costs will be extremely high (more on that in a minute), but your threads would probably still be much more efficient than running more Sidekiq processes. Likewise, if your background jobs are doing very little I/O (less than 50% of their total runtime) you may want concurrency settings as low as 5.

In conclusion, while the memory costs of adding 1 additional are linear, the benefits are not. 10 threads is a great default for most apps using Sidekiq, but 5 to 128 is a reasonable range. According to Amdahl's Law, the following table will provide a good starting point:

| % Time in I/O | Concurrency Setting |
|---------------|---------------------|
| 50% or less | 5 |
| 50-75% | 10 |
| 75-90% | 25 |
| 91%+ | 125 |

Judge the amount of time spent in I/O for your background jobs by doing a "back-of-the-envelope" calculation by looking at your APM (New Relic, Scout, Skylight) dashboards. Look at the top 5 jobs by "percentage of time consumed" (that metric is always average time multiplied by jobs-per-minute), and get a sense of how much time each job spends waiting on the database or calling out on the network.

You may have the intuition here that concurrency settings should somehow be related to the number of CPU cores available. In theory, if we set concurrency correctly, we should always have 1 thread running Ruby code (holding the GVL) at any given time. The other threads will either be waiting on I/O to return or idling, neither of which uses a lot of CPU. So, in theory, each Sidekiq process should completely saturate 1 CPU thread when we're under heavy load. So, concurrency settings are actually *independent* of the CPU thread/core count, and in order to take advantage of additional CPU threads, we're going to need to spawn more Sidekiq *processes*, which is something I'll cover in a separate email.

So I've covered the "theoretical" or the "starting point" of where to set your concurrency - so what are the metrics in production that will tell you whether or not your settings are correct?

If memory usage is too high after changing this setting, you'll have to tune concurrency downward. I'll talk about managing Sidekiq memory usage in later emails, but remember that high concurrency will directly lead to high memory usage. If CPU utilization is low *while you're under high load* (that is, while the process is working through a full queue), you may benefit from tuning the concurrency setting upward.

Don't forget that your concurrency setting *must not exceed* the available ActiveRecord database pool size. More on that in a later email.

Well, that's all I've got on Sidekiq's concurrency setting. You can reply to this email with questions, comments or ideas for future emails in this series. Here's what's coming up:

* MALLOC_ARENA_MAX and Jemalloc
* Idempotency
* Multi-threading safety
* Setting database connection pools safely
* Running multiple processes per host
* Fanout, batching and push_bulk
* Queue design
* Locks (SQL + Redis)
* Deployment and host configuration
* Scaling (queue depths)
* Timeouts
* Maybe even more!

See you next week with more!
