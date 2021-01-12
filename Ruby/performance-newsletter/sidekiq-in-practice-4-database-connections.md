Hey Rubyists,

Welcome to the fourth part of my Sidekiq in Practice email series. This email series is intended to be a "missing manual" for running Sidekiq in production, a guide to all the little details of running and scaling our beloved background job framework. I hope you're all finding it useful. I'm really enjoying your comments and questions as well - please do remember that you can reply directly to any of my emails to contact me.

This week's email is about SQL database connection pools.

This email is available as markdown/Github Gist here: https://gist.github.com/nateberkopec/2d1fcf77dc61e747438252e3895badf0

Links to previous emails in this series are at the end.

## DB Connection Math

Database connection pools. Everybody's favorite setting to forget about.

I had a client a while back whose entire Sidekiq installation had been brought to the ground - jobs taking 30+ seconds, throughput nearing zero - all because their database connection pool size was set to the old Rails default of 5 and their Sidekiq concurrency was the default 25.

Database connection pools are really confusing for people because you have to manage database connections at 4 different levels:

1. At the database
2. At each server/dyno
3. Per Ruby process (this is where the ActiveRecord "pool" setting takes effect)
4. Per thread.

Let me talk a bit about each level.

First, there's the database. We have just one SQL database in most setups. A database can only handle so many connections. Generally, over 500 connections, things start to slow down if the server doesn't have enough CPU resources. Heroku, for example, enforces a 500 connection limit on all of their database plans.

The reason Heroku has a connection limit is because idle database connections are not free, and they want you to use a database connection pooler at the dyno level to reduce idle connection count. I've seen benchmarks showing that a MySQL database with 1000 idle connections is 1% as fast as a database with just 1 idle connection - it's that bad! Of course, more CPU resources means more of an ability to handle lots of idle connections.

What does a connection pooler actually do? Let's go down a level to a single server to find out.

Connection poolers manage our database connections on a per-dyno basis. I'm going to use pgbouncer, the popular postgres pooler (ha!), as an example but all database engines have similar projects. Pgbouncer is a proxy for database connections. It sits between your Ruby processes and your database.

Most pgbouncer deployments, such as the Heroku pgbouncer buildpack, run an instance of pgbouncer on each of your servers. All of it's settings, therefore, are on a per-server basis (there is no "awareness" of what's going on in other servers).

Regardless of whether or not you use a connection pooler, the total connections to a database equals the number of connections per server times the number of servers. Total DB Connections = Connections per server * server count.

We also have a connection pool in each Rails process - this is the ActiveRecord connection pool. We set it in database.yml. Total DB Connections = AR Database Pool Size * Processes per server (usually set with WEB_CONCURRENCY or SIDEKIQ_COUNT) * Server count.

As an example, if you're using the default ActiveRecord pool size of 5, the default Sidekiq concurrency of 10, 5 Sidekiq processes per server, and you have 5 servers running, you'll use 125 database connections.

However, I already alluded to the idea that running a Sidekiq concurrency *higher* than the number of available database connections in the pool might be a bad idea. Why?

Threads are the things which actually need and use database connections. They drive the entire calculation. Think of threads as a single "context of execution", one little worker that executes jobs. All of our Ruby threads share the same memory, but they can execute entirely different jobs concurrently.

All of our Sidekiq threads need an ActiveRecord database connection.

If a thread can't get a free database connection within 5 seconds, you get a connection timeout error. That's bad. But even if they don't timeout, we don't want our threads to spend time *waiting* for a free database connection *at all* - that's wasted time. It may not raise an exception, but if each thread ends up waiting for a free database connection because concurrency is set to 10 but the pool size is just 5 and 5 threads are already using connections, then we're adding latency to job execution that doesn't need to be there.

In Sidekiq world, then, total DB connections = minimum(Threads That Need a Database Connection, AR Database Pool Size) * Processes per Server (WEB_CONCURRENCY or SIDEKIQ_COUNT) * Server Count.

Note the "minimum" function there. Setting your database pool to 100 and your Sidekiq concurrency to 10 won't use 100 connections, because there's only 10 threads to actually *use* the database connections you've made available.

Now that we've got the defintions and the theory down, let's answer the two important questions:

1. What do I set my ActiveRecord pool size to, given a particular Sidekiq concurrency setting?
2. When do I need to use a connection pooler (such as pgbouncer), and what settings should I use?

**Most of the time, your ActiveRecord pool size should be exactly the same as your Sidekiq concurrency setting**. Setting the pool size to a number *smaller* than Sidekiq's concurrency means some Sidekiq threads will become blocked waiting for a free database connection. Setting the pool size to a number *higher* than Sidekiq's concurrency has no effect.

A great way to do this is to use a single environment variable to set thread counts across your entire codebase. Luckily, this is supported and encouraged by Sidekiq.

In database.yaml:

```
production:
  url:  <%= ENV["DATABASE_URL"] %>
  pool: <%= ENV["DB_POOL"] || ENV['RAILS_MAX_THREADS'] || 5 %>
```

In your Procfile or whatever you use to start Sidekiq:

```
$ RAILS_MAX_THREADS=10 bundle exec sidekiq
```

The magic of RAILS_MAX_THREADS is that Sidekiq will use it to configure it's own concurrency if you haven't specified that anywhere else (like in sidekiq.yml) (https://github.com/mperham/sidekiq/blob/85a1be368486e22e17ee8a30bce8b4a8f7b9dca2/test/test_cli.rb#L36). So, we can use it to set our database pool size and Sidekiq concurrency at the same time!

Second, **you need to use a connection pooler if you have a large number of idle threads**. This does often happen with Sidekiq, as Sidekiq load can be very "bursty" as big batches of jobs get enqueued. The rest of the time, those idle database connections just add load to your database.

Pgbouncer has a lot of config settings (https://pgbouncer.github.io/config.html), but the main one is the `default_pool_size`. That's the number of *outgoing* connections pgbouncer will make to the database. Thus, the idea is to set this default pool size to some number *less than* your current Sidekiq concurrency times the number of sidekiq processes per server.

For example, if we have a Sidekiq concurrency of 10 and have 4 Sidekiq processes on our server, we might set the pgbouncer pool size to something like 20 (half of 10 times 4).

What happens, though, when *all 40* of those threads needs to talk to the database at the same time?

What connection poolers CAN'T do is reduce database load from *active* connections that need *do work*. If, like in the previous example, you have more Sidekiq threads that want to talk to the database than you have connections in the pgbouncer pool, those Sidekiq threads will have to wait until a connection becomes available.

Don't bother with pgbouncer or other connection pools until you absolutely are required to by your database provider, or you exceed 500 total connections. It's generally not worth the hassle and, frequently, as applications scale, they have lots of *active* database connections and not lots of *idle* ones, and so a connection pooler doesn't solve their problems.

If you're struggling with connection limits, particuarly on Heroku Postgres, consider Amazon RDS, which allows higher connection limits in the thousands on their higher-end database plans.

One other approach might actually be to reduce Sidekiq's concurrency setting.

I delved into Sidekiq's concurrency setting very deeply in a recent email newsletter (here: https://gist.github.com/nateberkopec/b0a10f2f5659b76c6e52a129f03fb3b2). Summary: The best Sidekiq thread count setting for you depends on the percentage of I/O done in a job. Sometimes, reducing Sidekiq concurrency would be better than increasing it in order to reduce database connection load, because each additional Sidekiq thread has less additional benefit than the one that came before it, but it still uses 1 more db connection. Marginal costs are linear, but marginal benefits are reducing. For example, 10 might be an appropriate compromise for someone trying to save on DB connections, even if a Sidekiq process at concurrency 20 could process 25% more jobs than one at concurrency 10.
