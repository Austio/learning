### Generators

#### Generator functions return generator objects

```
> gFunc = function*() { console.log("foo") }
> gFunc().next()
foo
{ value: undefined, done: true }

// We will be using IIFE to get obj initially
// gObj short for generatorObject
gObj = (function*() { yield "foo" })()
gObj.next()
```

#### Yielding in function will return a value

```
> gObj = (function*() { yield "foo" })()
{}
> gObj.next()
{ value: 'foo', done: false }
> gObj.next()
{ value: undefined, done: true }
```

##### On Yield vs Return

Yielding can be thought of as return that allows re-entry.
 1. return => currently executing function popped from stack and gone (if no references to it)
 2. yield => next() interprets the gFunc until next yield, which it returns and leaves function in current state
 until next() called again
   a. Can return multiple values
   b. re-entry is possible anywhere
   c. re-entry always right after last yield

```
> gObj = function*() {
>   yield 'foo1'
>   yield 'foo2'
>   yield 'foo3'
> }
> gObj.next()
{ value: 'foo1', done: false }
> gObj.next()
{ value: 'foo2', done: false }
> gObj.next()
{ value: 'foo3', done: false }
> gObj.next()
{ value: undefined, done: true }
```

### What is a generator?

An iterator
  a. JS obj that has a next() function which returns `{ value: Any, done: Boolean }`

#### What is an iterable and what is it used for?

Iterable
  a. Object which has the Symbol.iterator property which is a function that returns an iterator

When you execute a for/of loop, JS will look for Symbol.iterator of on object you are iterating

```
Symbol.iterator
> Symbol(Symbol.iterator)

### generatorFunction vs generatorObject

gObj are iterables, gFunc are not, you can't run for/of loop on a gFunc


