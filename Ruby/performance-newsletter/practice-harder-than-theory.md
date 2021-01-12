Last week was the first week of my summer workshop tour. Part of the reason I do the workshops is because performance work is often much harder in practice than it is in theory, and I like to "be there" to help attendees when they get stuck applying performance improvements to their complex, real-world Rails apps.

Most applications that even need to start thinking about performance are successful legacy applications - the apps are often 4 years old or more, the business has now achieved product market fit and is making decent money, but now the app feels slow or is costing a lot of money to deploy. The old mantra: "Make it work, then make it clean, then make it fast" - they've now reached that final step. But doing performance work on that kind of application is a hell of a lot harder than blog posts and even my course can sometimes make it look.

Fixing N+1s with includes and eager_load is the perfect example.

Last Friday was the inaugural running of my ActiveRecord performance workshop, and one of the attendees was struggling with an N+1. It was easy to identify the final callsite of the N+1 (the line of code the actually triggered the query), but it was far, far harder to figure out where to insert the includes call to fix it.

includes and eager_load are actually pretty easy to understand conceptually, and your run of the mill intro blog post will make it seem like a piece of cake.

You've got a blog app that has posts and comments. If you want to render the comments for each post, make sure you Post.includes(:comments). Bam.

However, in the real world, the distance between where the call is actually triggered and where the includes has to go is often several callstack layers apart.

In this particular example at my workshop on Friday, there were about 5 or 6 layers of indirection between where the includes call needed to go and the final callsite!

This is part of why tell people to "bring the Frankenstein" app to my workshops. If I teach you how to use includes on a simple, toy app and then you go home, try it on your Frankenstein app and get stuck, I haven't done my job.

Anyway, figuring out where includes or eager_load goes is something of an art that requires a bit of knowledge about how ActiveRecord lazily prepares queries and a mental model of what's happening at each layer of the callstack. Working through specific examples together really seems help people to "get it".

So, if you've read a blog post (or even part of my course) and struggled to go implement it on your own app, know that you're not alone. Applying the concepts to a complex app is hard, and you'll need to do it a few times to get the hang of it. Stick with it!
