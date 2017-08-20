## What is Functional Programming

 - Modeling your program in a way that functions define the architecture

## Why Functional Programming

 - Can be Easier to understand
 - Lets use concepts that are provable, trustworthy and understandable
 - Less to Read if you can trust
 
## Definitions
 - Impurity - 
 - Point Free Style - Doing your best to not pass arguments that are solely forwarded to another function.
 - Excapsulation - Hiding details in a facade
 - Abstraction - Creating appropriate layers of separation so that we can reason about each piece (20:00)
 - Pure - No side effects

## What is a function
 - Must have a return value (no return is a procedure)
 - Uses inputs to determine output value

## Impurity
 - Side effects bad because it makes a line hard to predict outside of the context of all other lines
 - Impurity optimizes for *writing* and makes it harder for *reading* because you need much more context to understand and run
 - Look at both uses of variables not passed as argument or things that affect 'outside'
  
## Purity
 - Makes it easier to debug.  The bug will most likely be in your side effect code.  
 - Importance is in observability *not* academically, meaning that what matters is that all side effects are encapsulated in the function and have no affect outside
 - 