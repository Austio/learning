I've learned a lot over the last 4 years of teaching Rails performance.
I wrote a blog post about the things I've learned about Rails software shops while trying to teach them performance over the last 4 years. You can read that post here.

One question I got yesterday was "how much of what you do is Rails-specific?" The question was in regards to my course, the Complete Guide to Rails Performance.

The answer is that shockingly little of what I teach is specific to Ruby on Rails. People who have purchased and run through the CGRP already know this, but I think many who buy that course are surprised with how little of it actually talks about Rails.

Much of what I do isn't even language-specific. All of what I teach on horizontal and vertical scaling, for example, is applicable not just to any language but to any system that queues and does work. That's a big bucket that includes databases, background jobs, even the CPU itself. It turns out so many of the systems around us, both in computer programming and in the world at large can be modeled by M/M/c queues.

I do think there's a bit of prejudice to the question, sometimes, though, of my "Rails-specificity". That assumes that there's something unique that makes Rails applications slow.

Is it Ruby? I don't think so. I've blogged about that in the past.

Is it something in the framework itself? This one is more of a maybe. Most Rails applications have issues with their usage of ActiveRecord. It's possible that the ActiveRecord pattern encourages poor database usage. However, I simply haven't seen enough non-Active-Record apps to know if someone has divined the secret solution yet. I doubt that they have, but I could be convinced. In any case, there aren't any perf problems caused by ActiveRecord usage that are unfixable. These problems make up the majority of my Rails-specific content.

So much of what I teach is applicable to any Ruby application. I'd estimate 80%+ or more of my workshops and course content is not specific to Rails at all. Your profiler, for example, doesn't care what framework you're using - it's just profiling whatever runs!
