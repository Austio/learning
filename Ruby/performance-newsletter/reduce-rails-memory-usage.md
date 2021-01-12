
Hello Rubyists,

Most Ruby web applications will eventually run into a memory constraint. There's just two resources that you have to balance on a web application box: memory and CPU. Everyone that's running Ruby web applications is maximizing their headroom based on one or the other - 90% CPU utilization but 10% memory utilization, or, more frequently, 90% memory utilization and 10% CPU utilization.

This pattern of memory bottlenecking is frequently found in background job processing and in applications which serve low traffic but have a large amount of features (enterprise/B2B).

That means that if you can find a free or easy way to decrease your memory usage, you'll take it. It means you might be able to run more Ruby processes per server, decreasing your operational costs.

One way to reduce memory usage that's not exactly groundbreaking or extreme but that I think is extremely underused is to only `require` the parts of the Rails framework that you actually use.

This won't give you massive savings (I think anywhere between 2-10 megabytes per process would be a reasonable expectation), but every little bit helps.

Basically, the magic is all in a single line in your config/application.rb:

require 'rails/all'

All that does is load all.rb from Railties.

Instead of letting all load all of our frameworks for us, we can pick and choose what frameworks to load ourselves:

require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
require "active_job/railtie"
require "action_cable/engine"
require "action_mailbox/engine"
require "action_text/engine"
require "rails/test_unit/railtie"
require "sprockets/railtie"

From there, we can just comment out anything we don't actually need. There are some obvious ones in this list that some people will just never use, ever, in their application, if they've chosen a different gem or if the app doesn't need it: ActiveRecord, Sprockets, ActiveStorage, ActionCable and ActionMailbox come to mind.

derailed-benchmarks, by Richard Schneeman, is great for measuring the gains you can get from these kinds of changes. The output looks like this:

active_record/railtie: 3.3203 MiB

This memory usage comes from initializers, railties, and code loading. If this app didn't use ActiveRecord (it does, but say it used Mongo), that would be a wasted 3MB just hanging around.

One of the biggest gains you can make is usually removing ActionMailer, if your application sends no mails. Depending on the version of the mail gem you depend on, the savings can be a few MB to as much as 30 megabytes. Sprockets, ActiveRecord, and ActiveStorage will save you a few megabytes each as well.

I like this hack as it only requires a few lines of change and it's not very brittle. It also makes any future Rails frameworks (e.g. the new ActionText and ActionMailbox) opt-in rather than opt-out, which I prefer.

I gave a talk at Railsconf a while ago about the underlying modularily of the Rails framework, where I talk much more in depth about this exact hack and use it to help me write a tweet-length (140 characters or less) Rails application. 
