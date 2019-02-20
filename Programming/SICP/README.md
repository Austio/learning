### SICP: Structured Interpretation of Computer Programs

[Video Lectures](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-001-structure-and-interpretation-of-computer-programs-spring-2005/video-lectures/1a-overview-and-introduction-to-lisp/)
[Interactive Book](http://sarabander.github.io/sicp/html/index.xhtml#SEC_Contents)

#### Chapter 1 Building Abstractions with Procedures
Computer Science is really about controlling complexity in large programs.  
It is different than physical systems b/c it is an imagined system, not real.  Electrical engineers have physical constraints when building (tolerance, noise).  Constraints in CS are only the limitations of our own minds.

 - Declarative - What to do
 - Imperative - How to do something
 - Process - Like a magical spirit that lives in computer and does something
 - Procedure - Pattern of Rules, ways to talk about Imperative knowledge

##### Techniques
Black Box Abstractions (function) - Suppress Detail
Conventional Interfaces
 - Think adding 2 things together.  Numbers, Vectors, Sin waves.  
 - How do i structure that addition in a way so that the next thing that comes along will be able to be plugged in
Metalinguistic Abstraction 
 
##### Language Parts
 - Primitive Elements/Expressions
 - Means of Combination - compound elements from simpler ones
 - Method of Abstraction - compound elements named and manipulated as units
 
Lisp in Particular
 - Uses Prefix Notation and fully parenthesized
 - Combination ()
  - (+ 1 2) 
   - () is a combinator
   - + is an operator
   - 1 and 2 are opperands
 - Abstraction - Define
 - (DEFINE A (* 5 5))
 - (* A A)
 - (DEFINE (SQUARE x) (* x x))
 - (DEFINE SQUARE (LAMBDA x) (* x x))
 - Can't tell the difference between primatives and built in (+ vs SQUARE)

