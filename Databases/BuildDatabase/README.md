### Building Database w/ Index

The structure we will use is common in most all relational databases B-Tree.

 - Node: Place to store values in the tree.
 - Branch: Connection between two nodes.
 - Leaf: Node without any children.  At bottom of the tree.
 - Depth: Number of connections up to the root node. 
 - Height: Number of connections on longest path down to a leaf.

 B-Tree is a specialized tree in which 
 - Many items are stored sorted in a single node.
 - Each node has several children, 1 more than number of items. 
 - Each leaf need to have the same depth forming a triangle.
 - Each leaf is of the same height of h
 - Each node must have at least t -1 keys
 - Each node has at most 2t - 1 keys
 - Each internal node has at most 2t children
 
 Because of this structure, many nodes can be loaded at ones from page or memory to reduce i/o 

Definitions
 - root tree root[T] with properties where
 
Every node x has 4 fields
 - number of keys stored in any node, n[x]
 - n[x] keys them selves stored in nondecreasing order
   - key[n][x], key[n+1][x], ...
 - A boolean value leaf[x], true if a leaf, false otherwise
 - n[x] + 1 pointers to child nodes
 - c[n], c[n+1]

So if we had values 2 and 4, you could arrange the pointers in an array like so
 - 0 - c[n] (ptr to less than key[n)
 - 1 -  key[n] (2) 
 - 2 - c[n+1] (ptr to between key[n] and key[n+1])
 - 3 -  key[n+1] (4)
 - 4 - c[n+2] (ptr to greater than key[n+1]

// https://webdocs.cs.ualberta.ca/~holte/T26/b-trees.html
- They are perfectly balances (leafs at same depth)
- Every node except the root is at least half full (m/2 values) and cannot contain more than (m-1) values.  The root may have any number of values 1 to m-1
