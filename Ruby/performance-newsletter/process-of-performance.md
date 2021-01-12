Performance work is mostly the application of the scientific method to making a software program faster or more resource-efficient.
First, we start with an observation. One possible observation might be that the program uses a lot of memory. Most Rails processes use about 512MB of resident set size, so a process using more than 1GB usually has a memory consumption issue. Or, as another example, maybe we open our New Relic dashboard and see that a particular controller action has an obvious N+1, because the User table is looked up 30 times on average during that action.

This observation about the state of the world moves us into the second stage of the scientific method - generating hypotheses. Sometimes, we can do this without the aid of any tools at all. For example, I know a lot of stuff from looking at hundreds of Rails applications over the years, and can form hypotheses about performance with very limited observations. I know, for example, that a Sidekiq process with 3GB of memory usage and a concurrency setting of 25 probably is experiencing a bad interaction with glibc malloc and should switch to an alternative memory allocator.

However, most of the time we need more observations and more data to generate better hypotheses about what is happening. This is what profiling is for - it's a bit like a microscope. It makes very minute behaviors obeservable, and helps us figure out what is going on. We can account for every millisecond or megabyte, down to the level of an individual line of code. This level of detail gives a very clear picture.

Profiling helps us to form a very detailed and precise hypothesis about what's wrong with the application. Let's say our profiler has identified that we spend 30% of our memory usage on a single line of code in the application. That's good to know. Now what?

You could just make a change that you think will fix it, and then deploy it to production. But that's skipping a step of the scientific method, which is to test our hypothesis against the real world by doing an experiment.

This is what a benchmark is. Profiling isn't the "real world", because it introduces a lot of overhead and makes our code a lot slower. Benchmarking, by comparison, has almost no overhead at all and can tell us the "truth" about our proposed change.

We craft a benchmark to test our hypothesis. In the case of a line of code allocating a lot of objects, I would probably write a custom benchmark using ObjectSpace.count_objects:

GC.disable
before = ObjectSpace.count_objects
# code to be benchmarked goes here
after = ObjectSpace.count_objects
puts(before - after)

You could run this code by using ruby on the command line ("ruby my_benchmark.rb") or rails runner ("rails runner my_benchmark.rb") if you wanted to benchmark some code from a Rails application.

Now we have a test of our change. Usually, I would encourage you to check this test in to a benchmarks folder ("/benchmarks") and post the results in the pull request that you're making to your project.

This process is good, but of course, it can't be perfect. There will always be differences between our development machines and our production environment. But generally, the effect sizes will be similar, if not exactly the same. If they're not the same, you'll learn a lot by trying to track down why!

Then, we'll analyze what effect our change has in production using the same production metrics we used to start the whole investigation.

This process is simple and timeless. It's the scientific method:

* Observation (Noticing behavior in production or development)
* Hypothesis (Profiling to figure out what's causing the behavior)
* Test (Benchmarking)
* Analyze (Observing new production behavior)

There's major downsides to doing this process out-of-order. Premature optimization is the act of skipping this process altogether and making changes to applications without regard to observation or testing. Benchmark-driven-development is the act of using microbenchmarks for things like appending to arrays or concatenating strings, skipping the observation and hypothesis steps, and then applying those changes to your application.

The scientific method isn't broken, so don't fix it - increase the rigor of your performance process and reduce wasted work and time by following its steps every time.
