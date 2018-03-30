### **Summary 1**

1.  EC need a way to know of variables and fxns it has access to
2.  Variable Objects (VO) which store variables, function declarations and parameters

```js
// Example EC
stack = [ globalEC, '<fooEC>']

'<fooEC>' = {
  VO: {
    //context data (var, FC, arguments)
  }
}

// real exapmle
var a = 10;
 
function test(x) {
  var b = 20;
};
 
test(30);

// Variable object of the global context
VO(globalContext) = {
  a: 10,
  test: <reference to function>
};
  
// Variable object of the "test" function context
VO(test functionContext) = {
  x: 30,
  b: 20
};
```

### Global vs Function Objects

1. Variable Objects at global level are different than function
 * global VO === this === global
 * VO === AO, <arguments>, <formal parameters> added
 
2. Global: 
  *  a. created before any contexts, ends when program ends
  *  b. initialized with properties like *Math*, *String*, *parseInt* 
  *  c. window is global in BOM
  *  d. not accessibel by name
  *  e. VO(globalContext) === global

```js
// 2
global = {
  Math: <...>,
  String: <...>,
  ...,
  window: global
};

// 2d
String(10); // means global.String(10)
window.a = 10 // global.window.a = 10 === global.a = 10
this.b = 20 //global.b = 20

// 2e
var a = new String('test');
 
alert(a); // directly, is found in VO(globalContext): "test"
alert(window['a']); // indirectly: global === VO(globalContext): "test"
alert(a === this.a); // true

var aKey = 'a';
alert(window[aKey]); // indirectly, with dynamic property name: "test"
```

3\. Function VO AKA Activation Object (AO)

 \* a. AO created on entering context of a function

 \* b. sets arguments (callee, length, properties-indexes (undefined if not passed in). Passed in objects have same memory space, those set to undefined do not

```js
// 3
function foo(x, y, z) {
  // quantity of defined function arguments (x, y, z)
  alert(foo.length); // 3
 
  // quantity of really passed arguments (only x, y)
  alert(arguments.length); // 2
 
  // reference of a function to itself
  alert(arguments.callee === foo); // true
  
  // parameters sharing
  alert(x === arguments[0]); // true
  alert(x); // 10
  
  arguments[0] = 20;
  alert(x); // 20
  
  x = 30;
  alert(arguments[0]); // 30
  
  // 3b
  // however, for not passed argument z, related index-property of the arguments object is not shared
  z = 40;
  alert(arguments[2]); // undefined
  
  arguments[2] = 50;
  alert(z); // 40
}
  
foo(10, 20);

```

4\. Phases of execution context

 \* a. Entering Context (before code execution)

 \* Formal Parameters (if function context): VO property set to name, value set to passed in value or \*undefined\*

 \* Function Declaration (FD): VO property set to name and value of FO, \*\*overwrite\*\* on duplicate

 \* Variable Declaration (var): VO property set to name, value of undefined. \*\*skip\*\* on duplicate

 \* b. Executing Code

 \* Go line by line and set/execute

```js
// 4a
function test(a, b) {
  var c = 10;
  function d() {}
  var e = function _e() {};
  (function x() {});
}
  
test(10); // call

AO(test) = {
  a: 10,
  b: undefined,
  c: undefined,
  d: '<reference to FunctionDeclaration "d">',
  e: undefined
};

// note it does not have reference to X, it is an FE (Function Expression) not an FD

// 4b
AO['c'] = 10;
AO['e'] = '<reference to FunctionExpression "_e">';

// Another classic example
// rules: fd declared on entering context
// var sematics after function and formal declared
alert(x); // function

var x = 10;
alert(x); // 10
 
x = 20;
function x() {}
 
alert(x); // 20

// VO = {};
  
// VO['x'] = <reference to FunctionDeclaration "x">
// found var x = 10;
// if function "x" would not be already defined 
// then "x" be undefined, but in our case
// variable declaration does not disturb
// the value of the function with the same name
  
//VO['x'] = <the value is not disturbed, still function>
// VO['x'] = 10;
// VO['x'] = 20;

if (true) {
  var a = 1;
} else {
  var b = 2;
}
 
alert(a); // 1
alert(b); // undefined, but not "b is not defined"

```

\#\#\#\# About variables

1\. Variables are ONLY declared usig the var keyword

2\. Any implied creations without var are actually creating a new property on the window object

3\. Variables have a {DontDelete} attribution, meaning you can’t remove them

 \* variables declared with eval do not have this property

```js
// 2
b = 10 // VO(globalContext) === global SO
global.b = 10

// 3
a = 10; //global.a = 10
alert(window.a); // 10
alert(delete a); // true
alert(window.a); // undefined
 
var b = 20; // VO['b'] = 20
alert(window.b); // 20
alert(delete b); // false
alert(window.b); // still 20

// 3a
eval('var a = 10;');
alert(window.a); // 10
alert(delete a); // true
alert(window.a); // undefined

```

<http://dmitrysoshnikov.com/ecmascript/chapter-2-variable-object/>
