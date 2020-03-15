SQL Queries for mere mortals

### Ch 7 - Thinking in Sets
 - Intersection: Find common in 2 sets (Customers who ordered both a and b)
 - Difference: In one but not other (Customers who ordered a but not b)
 - Union: Either one or other (Customers who ordered a or b)
 
#### Intersection (inner join)
 - a: 1,5,9,27,55
 - b: 4,9,55,96
 - intersection 9 and 55

#### Difference (outer join)
 - a: 1,5,9,27,55
 - b: 4,9,55,96
 - difference 1,4,5,27,96
 
#### Union (full join/union/union join)
 - union 1,4,5,9,27,55,96
 