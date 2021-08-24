## [Just Javascript](https://justjavascript.com/)

Critically evaluate the mental models that you have of code structures.  When reading code, think about the mental models you have constructed and what it means to do things like assign, set, etc.

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

