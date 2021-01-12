Database, Ruby, Memory - the three areas to check when speeding up Ruby apps.
A little bit ago, I blogged about the non-technical reasons why Rails apps are slow (https://www.speedshop.co/2019/06/17/what-i-learned-teaching-rails-performance.html). Those are the primary reasons - the main ones. However, they're not that helpful when you're sitting down and trying to make the Rails app in front of you any faster. "Alright, Nate, I work in a messed up software organization, but what do I do about this 500 millisecond controller action right in front of me?"

Well, that's an entirely differently checklist altogether! But it's a bit simpler and easier to run through.

When trying to make any Ruby code faster, I investigate these three areas, in order:
Database (not just time spent waiting on the database, but also time in ActiveRecord)
Ruby (time spent in Ruby)
Allocation (memory) (creating objects)

So, let's talk about each area a little bit.

I always start with the database. It's the primary reason Ruby applications get slow. Cavalier usage of ActiveRecord leads to unnecessary queries, and even queries which "hit the cache" are far slower than their properly eager-loaded equivalents.

One example of poor database usage is covered in this article I wrote about count, exists and present?

count and exists? always execute a query. They're a common cause of unnecessary round-trips to the database or N+1s. That article goes pretty deeply into their correct usage.

In order to profile database usage, my weapon of choice is Rack-Mini-Profiler. RMP profiles every SQL query that hit the database and shows you how long it took *and* where it came from - what line numbers and what parents called that line. It's invaluable for figuring out where to eager load properly.

Next, I take a look at the time spent in Ruby itself. This is a bit more complex and involved, and it's often *not* the biggest area for improvement, which is why I start in the database layer (we're increasing cost and reducing benefit as we get down this list).

To investigate time spent in Ruby, we use Ruby profilers, such as stackprof, Ruby-Prof, rbspy and more. I prefer stackprof and sometimes ruby-prof. stackprof is extremely easy to use if you're using rack-mini-profiler, since it's built-in.

I want to know what my Ruby program or controller action or background job or whatever is actually doing. Sometimes these profilers make things incredibly obvious - oh, you're spending 20% of your time reading a YAML file on every request, for example. Sometimes it's less obvious, especially if you're suffering from a only-slightly-slow function that's called 500+ times during the profile. But figuring out what the Ruby code is actually doing is the second most important thing we can learn about "why is this Ruby slow"?

Third is allocation. I think there's often an inordinate focus on garbage *collection*, but what more people should be focusing on is garbage *creation*. Creating objects is far from free - in fact, it's pretty expensive.

The Ruby core team uses a particular benchmark to measure their progress on Ruby 3x3 - the goal that Ruby 3 will be 3x as fast as Ruby 2. This benchmark essentially emulates an old NES console. It looks like we'll reach that goal - the benchmark currently runs about 2.5-2.8x faster than Ruby 2. However, this benchmark doesn't really create very many objects. It just generates a lot of CPU instructions and keeps memory access and allocation pretty low. This, in my opinion, is one of the primary reasons why that benchmark performs so much better than Rails benchmarks. Rails applications are only running about 70% faster on the latest version of Ruby when compared to Ruby 2, according to Noah Gibbs, maintainer of Rails Ruby Bench. So where'd the other 75-90% improvement go? Object allocation!

Richard Schneeman has doing an excellent conference talk this year on reducing object allocations to improve performance. You can see the RailsConf version of that talk here.

So, that's my usual process for making Ruby faster. Database, time in Ruby, memory allocation. I guess you could call it the DRM method (even though I hate DRM and love Ruby perf!). It's up to you, as the application developer, to figure out what work can be done more efficiently in those areas without compromising the correctness of the program. It still has to do what it has to do!
