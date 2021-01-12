Why work on performance? There are just two reasons.
It's really important to know why you're investing in performance work, because there's really only two reasons to do it.

The first to improve the customer experience - to make the site "feel" faster. The second is to decrease your operational costs.

Knowing which of these two objectives is the more important one for your app and your business is really important, because they lead to completely different priorities and objectives in your performance work.

Deciding between these two priorities isn't too hard. If you're spending too much money, you want to spend less. I think most companies should be spending an amount of money on their service hosting (your "all-in" cost, essentially your total Heroku or AWS bill) that's equal to or less than their requests-per-minute. So, if you've got 1,000 RPM, you can probably spend $1k or less on your hosting per month. If you're doing worse than that, and reducing that cost would make a difference to your company, you can work on that.

Knowing when to work on customer experience can be a little more complicated - you generally want to fix your site being too slow *before* people complain about it. But the link between website latency and revenue is fairly well documented. If it feels slow to you, it feels slow to your customers, and they like using your site less, and they'll use it less!

So, if you want to focus on reducing operational costs, what do you do?

This goes into what I was talking about in Monday's email: Little's Law and offered traffic (Erlangs). These two very simple formulas establish the relationship between latency, horizontal scale and the load your service can handle. The both use the same form: concurrent traffic equals average latency times the arrival rate of requests. For example, a service that has 100 requests per second and an average latency of 500 milliseconds will, on average, be serving 50 requests in parallel at any point in time. 50 parallel requests means you need to have the server capacity to handle that - not only in terms of EC2 instances and dynos, but also in your database plans. Reducing average latency decreases concurrent traffic and therefore reduces costs. I gave a talk at RubyKaigi this year about this very topic, and that talk has just been uploaded here.

Focusing on operational costs means focusing on reducing average latency and configuring everything in your stack for maximum throughput. Frontend is irrelevant, because you're not paying for that CPU time (phew).

If instead you choose to focus on improving the customer's experience, your performance work priorities have to change in a way you may find surprising: you have to focus on the frontend. Your customer's experience of your site is not to just read the HTML source directly once it returns successfully to their browser - there's dozens and dozens of additional resources and scripts that have to be downloaded, laid out and rendered. This is why I focus so much on frontend in the CGRP. Once people learn how to profile their frontends, their always shocked at how much of their frontend load time is *not* their backend responses, but other things like WebFonts and JavaScript.

One of the common mistakes I see here is people who want to improve customer experience focusing on backend response times. If your backend response times are extremely slow - let's say 1 second - they're still probably about 50% to 25% of the total page load or navigation experience. Profile it if you don't believe me, but scripting, layout and rendering really add up.

Know what you want to work on, and know your performance priorities. 