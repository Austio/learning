ActiveRecord::QueryCache — do you know what those CACHE lines in your logs mean?
There's one really common performance mistake I see constantly in Ruby/Rails web applications. It relies on a little-known and poorly-understood feature known as the ActiveRecord QueryCache.

Have you ever written this line of code before?

@current_user ||= User.find_by(id: session[:user_id])

Seems innocuous, right? Not a problem!

But what happens when the user isn't logged in? That is, when session[:user_id] is nil.

Try it in your Rails console:

irb(main):002:0> User.find_by(id: nil)
User Load (4.9ms)  SELECT  "users".* FROM "users" WHERE "users"."id" IS NULL LIMIT $1  [["LIMIT", 1]]
=> nil

Hmmm. A query is executed for a null id user! Well, that's obviously inefficient. But, current_user is checked usually many times per page. What happens if we call current_user many times during the request? It won't be memoized in @current_user, because the result of the query was nil.

In your console, you'll see the query execute multiple times, like this:

irb(main):003:0> User.find_by(id: nil)
User Load (0.5ms)  SELECT  "users".* FROM "users" WHERE "users"."id" IS NULL LIMIT $1  [["LIMIT", 1]]
=> nil
irb(main):004:0> User.find_by(id: nil)
User Load (0.5ms)  SELECT  "users".* FROM "users" WHERE "users"."id" IS NULL LIMIT $1  [["LIMIT", 1]]
=> nil

But that's not the way it will work in production, because in prod we have something called the ActiveRecord::QueryCache turned on. Turn that on in your console by doing this:

irb(main):007:0> ActiveRecord::Base.connection_pool.enable_query_cache!
=> true
irb(main):008:0> User.find_by(id: nil)
User Load (0.5ms)  SELECT  "users".* FROM "users" WHERE "users"."id" IS NULL LIMIT $1  [["LIMIT", 1]]
=> nil
irb(main):009:0> User.find_by(id: nil)
CACHE User Load (0.0ms)  SELECT  "users".* FROM "users" WHERE "users"."id" IS NULL LIMIT $1  [["LIMIT", 1]]
=> nil

See how the repeat of that query looks different? Instead of saying User Load (0.5ms) it said CACHE User Load (0.0ms). 0 milliseconds! That's great! That means getting things from a "hot" ActiveRecord QueryCache is free, right?

Not so fast.

That little number, in milliseconds, is just the amount of time spent going to the database and back, waiting on the I/O for your database result. It does not include the time spent building the query, generating the correct SQL string, and, most importantly, copying and creating a new object.

We can see this overhead clearly when we benchmark some different uses of ActiveRecord when the QueryCache is on.

Here's the benchmark I wrote:

user = User.first
ActiveRecord::Base.connection_pool.enable_query_cache!

Benchmark.ips do |x|
x.report("local variable")  { user }
x.report("AR every time")  { User.find_by(id: 1) }
x.report("AR every time, nil result")  { User.find_by(id: nil) }

x.compare!
end

And here's the result:

Comparison:
local variable: 27650490.8 i/s
AR every time:     6236.7 i/s - 4433.53x  slower
AR every time, nil result:     4555.9 i/s - 6069.19x  slower

When you realize that the alternative to using ActiveRecord::QueryCache is to store and access the result as a local variable, you can begin to see why it's slow in the first place. Local variable access is very, very fast. Executing the hundreds (perhaps thousands) of lines of Ruby that kick off when you call `User.find_by` is always going to be much, much slower than that.

In my original example, it's far safer to just have a safety valve when the session is nil or falsey:

@current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]

I did a quick Github search for this little "performance hack," and found over 100,000 examples of just this exact current_user situation alone.

Note how, on my machine, each call to the QueryCache took about 1/5 of a millisecond, while local variable access is basically free. I've had clients shave up to 100 milliseconds off controller actions through careful removal of QueryCache usage, simply by searching their logs for the "CACHE X Load" string.

So give it a shot. Pay more attention to "CACHE X Load" in your development logs. Because it certainly doesn't take 0.5ms, and it ain't free.
