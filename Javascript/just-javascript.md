## [Just Javascript](https://justjavascript.com/)

Critically evaluate the mental models that you have of code structures.  When reading code, think about the mental models you have constructed and what it means to do things like assign, set, etc.

 - Expression, something that answers a question
 - Literal, a primitive value

## CP2 Things in Javascript

In our Javascript Universe we have many things

Javascript is composed of two things
### Values

#### Primitives 
Permanent values, we can point to and reference them, but we cannot change,  create or destroy them
- undefined, null, strings, numbers, booleans, Symbols, BigInt 
  
#### Objects/Functions 
We can manipulate and define these
    - {}, [], () => {}
  
### Expressions

Expressions are the question that causes javascript to return an answer that is a value
 - it expresses a value
```
2 + 2  // 4
typeof "three" // string
```

### Summary

There are values, and then there’s code. We can think of values as different things “floating” in our JavaScript universe. They don’t exist inside our code, but we can refer to them from our code.
There are two categories of values: there are Primitive Values, and then there are Objects and Functions. In total, there are nine separate types. Each type serves a specific purpose, but some are rarely used.
Some values are lonely. For example, null is the only value of the Null type, and undefined is the only value of the Undefined type. As we will learn later, these two lonely values are quite the troublemakers!
We can ask questions with expressions. Expressions exist in our code, so they are not values. Rather, JavaScript will answer our expressions with values. For example, the 2 + 2 expression is answered with the value 4.
We can inspect the type of something by wrapping it in a typeof expression. For example, typeof(4) results in the string value "number".

## CP3 Values and Variables

Remember that primitives are immutable

```
// What does this do?
let something = 'foo'
something[0] = 'b'
console.log(something)
```

It prints 'foo' because strings are immutable primitives, not arrays, so you cannot change them.
Depending on which mode we are in (strict or not), it might throw an error or not

Variables are 'wires' to those primitive and constant values, which is why in the above you could do this

```
let something = 'foo'
something = 'b'
console.log(something) // prints b
```

Assignment rules
 - Left side has to be a variable
 - right side must be an expression (results in a value)

Right side expressions that are values are called 'literals', because they litterally are a value

### What are variables

In Javascript you can't Pass a variable, all functions will take the "value" of the variable and pass that down.  If that value is a primitive it is pass by value, if it is an array/object it is the reference to the object.

Variables only ever point to values, they don't point to other variables

To understand, let's evaluate EXACTLY what is happening here

```
let x = 10;
// Declare a variable x, draw the x variable wire 
// Assign x to 10, point the x variable wire to 10

let y = x;
// Declare a variable y, draw the y variable wire
// Assign y to x
  - Evaluate the expression x (question is x) answer is 10
  - Point y wire to 10
x = 0;
// Assign x to 0, point the x wire to 0
```

### Summary

Primitive values are immutable. They’re a permanent part of our JavaScript universe—we can’t create, destroy, or change them. For example, we can’t set a property on a string value because it is a primitive value. Arrays are not primitive, so we can set their properties.

Variables are not values. Each variable points to a particular value. We can change which value it points to by using the = assignment operator.

Variables are like wires. A “wire” is not a JavaScript concept—but it helps us imagine how variables point to values. When we do an assignment, there’s always a wire on the left, and an expression (resulting in a value) on the right.

Look out for contradictions. If two things that you learned seem to contradict each other, don’t get discouraged. Usually it’s a sign that there’s a deeper truth lurking underneath.

Language matters. We’re building a mental model so that we can be confident in what can or cannot happen in our universe. We might speak about these ideas in a casual way (and nitpicking is often counterproductive) but our understanding of the meaning behind the terms needs to be precise.
