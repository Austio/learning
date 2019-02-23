Hello Rubyists!

Welcome to the second part of my many-part series on Sidekiq in practice, based on the many years of experience I've had working with Sidekiq in production on client apps. The first email was very warmly recieved - thank you for all of your comments!
Eventually, I'll compile all of these emails into a short book that I'll be selling. So, slightly nicer formatting, maybe some other additional content and goodies will be included too.
This week's email is about idempotency.
You may view the previous email in this series, on Sidekiq's concurrency setting, here: http://eepurl.com/ghmV81
I have two quick points of clarification from that email:
Mike Perham wrote me on Twitter to say that he's skeptical of thread counts above 50, and that "people have reported instability" in MRI with thread counts that high. I was not able to find any reports online of anyone having issues with high thread counts in MRI. The only issue I could find on the Ruby core mailing list related to this was someone reporting a segfault with a high thread count, but it turned out that the error was actually that they were running out of memory. 
I still think very high (50-128) concurrency settings may be appropriate for some users with very high I/O workloads. That said, most applications fall in the 50-75%-of-a-jobs-time-is-in-IO range, so the default setting of 10 is great for most (as I mentioned in the email). I do not have any evidence that high thread counts in MRI are unstable, but, as I mentioned (and as others have found), they will use quite a lot of memory. More on memory reduction in another email.
Second, I got an email from Benoit Daloze of the TruffleRuby project kindly reminding me that Ruby != MRI/CRuby, and that the Global VM Lock is a feature of the C Ruby runtime, *not* of the language itself, so alternative implementations like JRuby and TruffleRuby have no limit on the number of threads which can execute Ruby code in parallel. By the way, did you know TruffleRuby runs Sidekiq now? (https://twitter.com/nateberkopec/status/1096878033762365442)
Right, onto our main topic!
## Idempotency ##
It's a big computer-science word, that. Idempotency. It scares people into thinking it's more complicated than it really is. But, it can *really* save you a lot of headache and trouble if you understand it and can implement in all of your Sidekiq workers. 
Simply put, an *idempotent operation* is one that, if executed twice (or any number of times), the *result* or *end state* remains the same.
Multiplying a number by 1 is idempotent. No matter how many times you multiply any number by 1, you still have the same number. Imagine a Sidekiq job that took a row in the database, multiplied a number in the row by 1, and then saved the row. You could perform this job an infinite number of times and the result would be the same.
Multiplying by 2 (x * 2) is *not* an idempotent operation. Start with x = 1. Multiply by 2. Now you have 2. Perform the operation again - now you've got 4. And so on. 
Mathematically, we could express an idempotent operation as f(f(x)) = f(x).
Imagine standing at a crosswalk. You push the button for the walk signal. This is an idempotent operation. You can push that button as many times as you want, but the operation is done, and you will not encourage the walk signal to appear any sooner. You could imagine that the pseudocode would be something like:
def push_walk_button
  @walk_requested = true
end 
No matter how many times you run that method, the end result won't be any different. **The state remains the same**.
Why is this important for Sidekiq?
In practice, "exactly-once" delivery of data in distributed systems is extremely difficult, some may even say impossible. This means that messages in the system (in Sidekiq's case, job tuples of [SomeJobClass, *args]) may be delivered to the end consumer 0, 1, or many times. Sidekiq is generally designed to be an "at least once" system. If you enqueue a Sidekiq job, it will be executed at least once, but it may be executed multiple times. 
This is where people get into trouble: how do you ensure that something happens *exactly once* in Sidekiq? For example - sending an email to a customer, or importing some users from an external service, or charging a user's recurring subscription?
While I just talked about how Sidekiq is generally an "at least once" system, I was talking mostly about "reliability" guarantees against things like people unplugging machines from walls and SSDs going up in puffs of smoke. In practice, the problem most people have with "at least once" delivery is *their own code* enqueueing the same job twice. For example, consider the following controller:
def create
  @user = create_user!(params[:user])
  SendWelcomeEmailJob.perform_async(@user)
end 
What might happen if someone hits the form submission button twice in a row (and create_user! succeeds thanks to some poor data validation)? You guessed it, two welcome emails!
The first tool I see most people reach for to solve this problem is job uniqueness plugins. Essentially, this is attempting to outsource idempotency to someone else. The most popular plugin is sidekiq-unique-jobs: https://github.com/mhenrixon/sidekiq-unique-jobs
Job uniqueness plugins generally work by creating a global lock around the tuple of [WorkerClassName, arguments] while the job is in the queue. So, the same job can't be enqueued with the same arguments. 
In theory, a job uniqueness plugin should eliminate the need for the programmer to think about idempotency. Just mark all your jobs as `unique: true` and you're done, right? No welcome email will ever be sent twice! Voila!
There's two major problems with this approach: uniqueness can only be a best effort, and not guaranteed, and all of these unique job plugins greatly increase Redis load and enqueueing latency. I'm not going talk too much about the former - just know that if you're running a bank on Sidekiq (!!!) you can't slap job uniqueness on your workers and be sure that everyone's deposits and withdrawals will only enqueue once.
The second part is more insidious. Job uniqueness *really* increases load on Sidekiq. Essentially each time you enqueue a job, you're creating a new lock. This can really get out of hand if you've got deep queues, too, since these locks live for as long as the job is in the queue. I'm going to talk more about locks in a later email, but they're relatively expensive on Redis. I've seen job uniqueness 10x a client's Redis load. And, as you may already know, Redis is designed to scale vertically (bigger and bigger single machines), so this is an expensive problem to create for yourself!
Any job uniqueness plugin will also increase the time it takes to enqueue a job. At least once additional network round-trip is required ("is this job already enqueued?"), doubling Redis load on enqueuing and doubling enqueuing latency.
What I would have you do instead?
Next week, we'll take a look at concrete examples of idempotent and non-idempotent workers, and how to make almost any worker idempotent.
Until then,
-Nate
Col