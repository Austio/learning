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

 Because of this structure, many nodes can be loaded at ones from page or memory to reduce i/o 

