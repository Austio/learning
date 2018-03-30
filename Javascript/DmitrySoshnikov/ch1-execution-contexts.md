### **SUMMARY 1** 

1. When control is transferred to a funciton, control is entered into an execution context (EC)
2. A set of EC form a stack [EC1, EC2, EC3] where the original one is the global EC (window)
3. When we enter into code, it pushes to the stack, when it finishes, we pop from the stack
4. **Global Code**: Processed at program level, anything in script tag or inline, (globalEC)
5. Function Code: On entering a function, we push to stack the function, see 2/3
6. Thrown but not caught exceptions may exist 1 or more contexts

```js
// 4.
ECStack = [ globalEC ]

// 5. 
(function foo(flag) {
  if (flag) {
    return;
  }
  foo(true);
})(false);

// first activation of foo
ECStack = [
  '<foo> functionContext',
  globalEC,
];
  
// recursive activation of foo
ECStack = [
  '<foo> functionContext – recursively', 
  '<foo> functionContext',
  globalEC
];

// 6 Code exits
(function foo() {
  (function bar() {
    throw 'Exit from bar and foo contexts';
  })();
})();
```

### Eval

Adds concept of a calling context, which means from where the eval function is called

```js
// influence global context
eval('var x = 10');
 
(function foo() {
  // and here, variable "y" is created in 
  // the local context of "foo" function
  eval('var y = 20');
})();
  
alert(x); // 10
alert(y); // "y" is not defined
```

```js
ECStack = [
  globalContext
];
  
// eval('var x = 10');
ECStack.push({
  context: evalContext,
  callingContext: globalContext
});

// eval exited context
ECStack.pop(); 

// foo funciton call
ECStack.push('<foo> functionContext');
 
// eval('var y = 20');
ECStack.push({
  context: evalContext,
  callingContext: '<foo> functionContext'
});
 
// return from eval 
ECStack.pop();
 
// return from foo
ECStack.pop();
```

<http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/>
