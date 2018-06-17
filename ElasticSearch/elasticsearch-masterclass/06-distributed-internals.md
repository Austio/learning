### Distributed Architecture

Shard -> Unit of storage for your entire index
Node -> Computer that can hold shards and query them

For example: 100 Vehicles in index
 -> shard 1 (S1): 1-50
 -> shard 2 (S2): 51-100
 
2 nodes

node1 has S1, node2 has S2 
  
Then you can have replicas of the shards, 
 -> rep1 -> replica of S1
 -> rep2 -> replica of S2

node1 is assign S1 and R2
node2 is assign S2 and R1

#### How Do Operations Work in Replication Context

Example Index (delete the same)
 - node2 is asked to index, it hashes the id and sees that it needs to go to node1.
 - node1 indexes it, then replicates the data to node2 for it's replica
 
Query
 - Round robbin, replicas can respond the same as primary
 
#### Step 
In indexing, the document is indexed, written to a buffer and then committed to a segment, the segment is an immutable index that is searchable