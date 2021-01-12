A memory-saving ActiveRecord setting has been used by just one application ever, according to GitHub
There's a common performance problem in many Rails background jobs.

Background jobs often do operations across large sets of data. Basically, they do silly things like User.all.each(&:send_daily_newsletter).

So, there's a problem with that query. In development and test environments, User.all will probably return a few rows, maybe a dozen at most. Most developers have extremely limited seed data on their local machines.

In production, however, User.all will probably return quite a few rows. Depending on the app you work on, maybe a few hundred thousand.

There's a tiiiiiny issue with a result set that returns 100,000 rows, and it's not just that the SQL query will take a long time to return. It will have irreversible effects on your Ruby app too!

The problem with that is large result sets in ActiveRecord can really blow up your memory usage. Due to some intricacies of the memory allocator Ruby uses, once a Ruby process uses a lot of memory, it tends to not give it back to the operating system, even though the memory is garbage collected. This is the allocator's fault, not Ruby's. I gave a conf talk at RubyKaigi about this behavior. We might be able to fix it over the next few years, but for now, we have to deal with it.

This is the kind of behavior that can often go overlooked and blow up in production. Even worse, most people seem to not really care about what goes on in their background jobs as long as they work, but then complain that their queues are filling up or they're running out of memory.

Having the tendency to fetch massive result sets is just one of the reasons background jobs can be slow and use lots of memory, but it's a common one. Since Rails 5.0 though, we've had a config setting that helps us to identify when this is happening. It's called warn_on_records_fetched_greater_than.

Just one app has ever used it, according to GitHub.

When set to an integer, this setting will print a warning to the logs if any ActiveRecord::Relation object returns a result set greater than that integer.

It's intended as a reminder that if you're fetching large result sets, you should probably be using find_each or other methods from ActiveRecord::Batches.

So, instead of

User.all.each(&:send_daily_newsletter)

You can use:

User.find_in_batches do |group|
group.each(&:send_daily_newsletter)
end

I think it would be reasonable for everyone to go into their config/environments/development.rb and drop this warning in right now. 1500 would be a sane value, as a result set greater than 1500 would be fetched in at least 2 pretty full batches.

config.active_record.warn_on_records_fetched_greater_than = 1500

Then, you'll see this warning in the logs when you exceed that limit:

Query fetched 1501 User records: SELECT  "users".* FROM "users" ORDER BY "users"."id" ASC LIMIT $1

Now, I'm not sure if I would drop this into application.rb or my production.rb environment file. It uses ActiveSupport::Notifications.subscribe("sql.active_record"), which means that we're using notifications to subscribe to every single SQL query. Local benchmarks show a very small overhead per query, but "adding overhead to every ActiveRecord request" is not always something you want to do.

It's probably useful to just turn it on development all the time and perhaps turn it on again only when you're running background jobs. For example, you could drop this into config/initializers:

if Sidekiq.server?
ActiveRecord::Base.warn_on_records_fetched_greater_than = 1500
end
