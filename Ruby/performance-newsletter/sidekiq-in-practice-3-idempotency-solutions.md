Hello Rubyists,

Welcome to the THIRD part of my many-part series on Sidekiq in practice, based on the many years of experience I've had working with Sidekiq in production on client apps.

I've gotten some feedback about how plain-text emails like mine are poorly formatted in many email clients. To fix that, you may now read this email as a (markdown-formatted) Github Gist: https://gist.github.com/nateberkopec/56d16a58b5666c46d8346f2f36e8444d

Links to previous emails in this series are at the bottom of this email.

This week's email is about *how to make jobs idempotent*.

Let's look at some real-world examples in CodeTriage (https://www.codetriage.com/), an open-source Rails application.

CodeTriage has a very simple job which updates an ActiveRecord object with some information from Github (https://github.com/codetriage/codetriage/blob/master/app/jobs/update_repo_info_job.rb):

class UpdateRepoInfoJob < ApplicationJob
def perform(repo)
repo.update_from_github
end
end

`update_from_github` does a network call and overwrites some attributes on a Repo with whatever the current info is on Github. **This operation is inherently idempotent**. If you enqueue this job 100 times for the same `repo`, the end state of the repository's database row **is exactly the same**, despite the fact that you performed 100 network calls and 100 row updates. This job is completely idempotent without any extra code.

A lot of jobs are like this. They're just like pushing the "push to walk" button or the "open door" button in the elevator. Adding uniqueness constraints to these jobs is pretty silly!

Another job, SendSingleTriageEmailJob, sends a single email to a user (https://github.com/codetriage/codetriage/blob/master/app/jobs/send_single_triage_email_job.rb). Here's a simplified version of that real-world job:

class SendSingleTriageEmailJob < ApplicationJob
def perform(id, create: false)
repo_sub = RepoSubscription.find_by(id: id)
return unless repo_sub

    assignment = find_assignment_for_repo_sub(repo_sub)
    if assignment
      assignment.update!(delivered: true)
      UserMailer.send_triage(assignment: assignment).deliver_later
    end
end

private

def find_assignment_for_repo_sub(repo_sub)
repo_sub.user.issue_assignments.order(:created_at).eager_load(:repo_subscription)
.where(repo_subscriptions: { repo_id: repo_sub.repo_id }).last
end
end

This job is not idempotent. Run it twice with the same arguments, and you will send two emails. How can we make this job idempotent?

Note how the `delivered` column is updated right before we enqueue an email to send. We can work with this attribute to ensure idempotency.

A sort of "naive idempotency" can be achieved simply by checking to see if the assignment is already `delivered`:

def perform(id, create: false)
# ...
if assignment && !assignment.delivered
assignment.update!(delivered: true)
UserMailer.send_triage(assignment: assignment).deliver_later
end
end

This will work 99% of the time. This "naive idempotency" - update a database column when the operation is done, and check before starting the work to make sure the state of the column is not yet changed - is Good Enough for a lot of jobs and work. You could think of this idempotency pattern as "Check State, Change State": check to see if the state is already what we wanted it to be, and if not, do the work to change it.

However, it's not completely robust. What happens if this job is enqueued twice *and* two threads start processing this job at the exact same time? Then, you've got a race condition, where both threads may think that the assignment is not delivered!

To fix this, we can introduce a row-level database lock:

def perform(id, create: false)
# ...
return unless assignment
assignment.with_lock do
return if assignment.delivered
assignment.update!(delivered: true)
UserMailer.send_triage(assignment: assignment).deliver_later
end
end

The introduction of this row-level pessimistic lock ensures that only 1 Sidekiq thread can be executing the block at one time. This more or less guarantees the idempotency of this job - any additional threads beyond the first will enter the locked block *only after the first job has completed*, which means `assignment.delivered` will be true, exiting the block.

However, there's one last bug here. How do we know the email is actually sent? Currently, we don't - it's given to another job via `deliver_later`. To be completely robust, we should only update the delivered attribute after the email is confirmed to have sent:

def perform(id, create: false)
# ...
return unless assignment
assignment.with_lock do
return if assignment.delivered
UserMailer.send_triage(assignment: assignment).deliver_now
assignment.update!(delivered: true)
end
end

You may be wondering - Nate, didn't you just change a Redis lock (job uniqueness) to a row-level SQL lock? Yes. Yes I did.

There are three reasons row-level SQL locks are superior to Redis locks:

* Locks are "first class citizens" in a SQL database. Literally the entire database is designed around locking. Locks in Redis are much more "ad-hoc" - Redis is a key/value store, it's not designed to manage locks.
* Job uniqueness (i.e. Redis locks for idempotency) adds an extra network roundtrip to *every single job enqueue* in your client, increasing latency *during the web response*.
* The big one: Job uniqueness locks live for at least as long as the job is in the queue (and, depending on your setup, while the job is executing). Row-level SQL locks only exist *during the specific portion of the job execution which requires idempotency*. This means that fewer row-level SQL locks will exist at any one time than a comparable Redis-based locking approach.

There are, however, some drawbacks, of course.

* Row-level SQL locks *hold the database connection* while waiting for the lock to unlock. This connection cannot be given to any other thread while we're waiting for it to unlock. This means that we can't really do anything inside the lock block that will take a large amount of time.
* This means we need to set a lock timeout in our database. Postgres, for example, doesn't have one by default.

In conclusion: don't just slap unique constraints on every job, use the "Check State Change State" pattern to make jobs idempotent, and consider row-level database locks before deciding you *must* do distributed locks in Redis with a job uniqueness plugin. 
