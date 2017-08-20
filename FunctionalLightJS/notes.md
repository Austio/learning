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
 - Idempotent
 - Makes it easier to debug.  The bug will most likely be in your side effect code.  
 - Importance is in observability *not* academically, meaning that what matters is that all side effects are encapsulated in the function and have no affect outside
 - In a mutable language like JS, it is just a 'level' of confidence of purity

## Arguments
 - unary => 1 argument
 - binary => 2 arguments
 - n'ary => many
 
```
function unary(fn) {
  return function one(arg) {
    return fn(arg);
  }
}

function binary(fn) {
  return function two(arg1, arg2) {
    return fn(arg1, arg2);
  }
}

function f(...args) { console.log(args) }

var g = unary(f);
var h = binary(f);

g(1,2,3,4); //[1]
h(1,2,3,4); //[1,2]

// implementing call
``` 
 
 

### Are these Pure?


```
const y = 1;
function foo(x) { return x + y }
foo(1);
```
Observably, yes, foo will always produce the same output given an input.


```
function foo(x) { return bar(x) }
function bar(y) { return y + 1 }

foo(1)
```
Bar is pure => given an input it will always produce another output
Foo is pure => it is obserably pure, but it does reference something external

```
function foo(bar) {
  return function(x) {
    return bar(x);
  }
}

foo(function(v) {
  return v * 2;
})(3);
```
both pure

```
function getId(obj) { return obj.id }

getId({
  get id() { return Math.random() }
})
```
no

