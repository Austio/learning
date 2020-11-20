## Background for the paper

RFC #677 - The Maintenance of Duplicate Databases

Problem: A database is shared amongst multiple computers/locations.  How do they handle multiple updates when they cannot talk to each other.  How do they pick the write that should be the "winner".  They used timestamps for this, whatever is the last wins.  But, how do they keep timestamps in sync?

## Paper

 - Recognizes that we want Total ordering, but we can't, the universe is only Partial Ordered.  People observe things and it impacts the order
 - Partial Ordering

Process P and Q send a message to each other at the same time.  There is no way to determine the absolute ordering, we have to order them as if they are concurrently.
 - How do we collapse this concurrency into a model we can understand
 - He picks a "Logical Clock", drop the idea of actual time
 - Each process will keep a local clock
   - Every time a process sends a message it will send it's logical clock
   - The receiving process will receive the clock, increment it's logical clock to be at least 1 higher, then use that value.  Because you will always receive after a send

For distributed locks
 - The process at the head of the queue has the lock
 - A process can remove itself by releasing and broadcasting it's timestamp
 - New processes send a request with their timestamp
 - All processes follow the logic clock

The problem of failure in this is a more difficult one.

Big ideas:
 - Actual events are only partially ordered
 - Don't fight the law of physics
 - Once you can agree on a total order with logic clocks, you

### Followups

Handling the Failure state in the locks
 - Paxos: The Part Time Parliment
 - Paxos made Simple


