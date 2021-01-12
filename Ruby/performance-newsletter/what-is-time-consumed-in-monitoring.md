Time Consumed - one of the first metrics I check on a new client app
At Monday's Rails performance workshop, I asked the attendees if they knew what "Time Consumed" meant. No one raised their hands, which I found shocking - I think Time Consumed is probably the most useful metric any application performance monitor can provide!

Time Consumed is a prominent feature of New Relic and Scout dashboards. Skylight has a similar metric, called Agony. It's actually a really simple metric.

For the selected time period - say, the last 24 hours - take the total number of requests the app has served and multiply it by the average response latency. That's your total "time consumed". So, if our theoretical app served 10,000 requests in 24 hours and the average time per request was 100 milliseconds, that's a total time consumption of 1000 seconds.

Then, for any individual controller action, we can do the same calculation and calculate what *percentage* of the total time consumed that action took up.

So, if our UsersController#index action was called 100 times over that same 24 hour period, and it's average latency was 300 milliseconds, then it consumed 30 seconds. New Relic and Scout express this as a percentage of the total time consumed - so 30 seconds divided by the total time consumed (1000 seconds) is 3%. New Relic and Scout would both report that controller as 3% of time consumed.

What's so powerful about that is that 99% of web applications follow a very interesting pattern: the top 10 controller actions, sorted by time consumed, usually make up about 80% of the total time consumed!

So that means that 80% of the time your application processes are busy doing work, it's just 1 of 10 controller actions. That's crazy!

This is no surprise to readers of the Complete Guide to Rails Performance, of course. Most fields of numbers follow this exact pattern. In nature, exponential distributions are actually the norm - not normal distributions. The world is not normally distributed.

So, what do we do with this information? Our APM is telling us what controllers make up 80% of our total time consumed, what does that mean?

This actually relates back to the discussion of offered and carried traffic that I've talked about on this newsletter before. Thanks to Little's Law, we can infer that if a controller action takes 50% of our time consumed, that means that 50% of the time that one of our web processes is active and doing work, it's performing that particular controller action. It's also accurate to say that 50% of our carried traffic is consumed by that controller action.

This has huge implications for performance optimization for throughput. If you're trying to scale your application to reduce request queueing times and improve your ability to handle traffic, making a controller action that takes up 50% of time consumed 2x faster means that you've *reduce the entire carried traffic of the application by 25%*.

Another way of looking at it might be that "time consumed" is "time spent waiting on your application by your customers". If a controller action takes up 50% of total time consumed, speeding it up by 2x means your customers are spending a total of 25% less time waiting on your backend in the future.

Whenever I come in to a new client application, one of the first thing I do is look at the APM dashboard of controller applications and sort by time consumed. This gives me a list of 10 controller actions where I can focus my performance work to have the biggest overall impact on customer experience and on scaling the backend.

I hope that was helpful. Talk to you again soon.