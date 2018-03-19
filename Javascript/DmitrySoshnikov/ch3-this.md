### Facts
1. `this` is a value of an execution context
2. `this` determined on entering a context
3. `this` immutable
4. `this` store on executionContext

```js
activeExecutionContext = {
  VO: {...vars, fxnDeclare, args},
  this: thisValue
}
```

### Reference Type
1. Hold the base object relation and value of 
1. can be for identifier or property accessor
 a. identifiers = var names function names aarguments

```js
const genericFooReference = {
  base: global,
  propertyName: 'foo',
  strict: true,
};

// global identifier references
var foo = 10;
function bar() {};

var fooReference = { base: global, propertyName: 'foo' };
var barReference = { base: global, propertyName: 'bar' };

// Property accessor and its reference
foo.bar();

var fooBarReference = {
  base: foo,
  propertyName: 'bar'
};
 
GetValue(fooBarReference); // function object "bar"
```

### Accessing Reference Type Values

`GetValue` method actually gets the value when you use access, psuedocode
```
function GetValue(value) {
  if (Type(value) != Reference) {
    return value;
  }
  
  var base = GetBase(value);
  if (base === null) {
    throw new ReferenceError;
  }
  return base.[[Get]](GetPropertyName(value));
}

GetValue(fooReference); //10
GetValue(barReference): //function object "bar" 

### Determining this in Global
1. `this` always global object
2. can be referenced indirectly or directly

```js
// explicit property definition of the global object
this.a = 10; // global.a = 10
console.log(a); // 10
 
// implicit definition via assigning to unqualified identifier
b = 20;
console.log(this.b); // 20
 
// also implicit via variable declaration because variable object 
// of the global context is the global object itself
var c = 30;
console.log(this.c); // 30


// For functions

var foo = {x: 10};
 
var bar = {
  x: 20,
  test: function () {
    console.log(this === bar); // true
    console.log(this.x); // 20
    
    this = foo; // error, can't change this value
    console.log(this.x); // if there wasn't an error, then would be 10, not 20
  }
};
 
// on entering the context this value is determined as "bar" object
bar.test(); // true, 20
foo.test = bar.test;
 
// however here this value will now refer to "foo" – even though we're calling the same function
foo.test(); // false, 10

function foo() { console.log(this) }
foo(); // global
 
console.log(foo === foo.prototype.constructor); // true
 
// but with another form of the call expressionof the same function, this value is different
foo.prototype.constructor(); // foo.prototype
```

### Determining this in function
1. `this` provided by the caller who activated the context (i.e. parent context)
2. If the left hand side of the call parenthesis there is a value of Reference type 
  a then this is set to the base object of reference type
3. In all other cases, this is set to null, which converts to global object in all but strict mode

```js
function foo() { return this }
foo(); // global

// foo is an identifier so has a Reference type created on global
var fooReference = { base: global, propertyName: 'foo' };

// Reference which base is foo (left of parenthesis()) and is used as this
var foo = {
  bar: function () { return this }
};
foo.bar(); // foo

// We can get a different value, test 
var test = foo.bar;
test(); //global

var testReference = { base: global, propertyName: 'test' };


```

```js

// Other examples
function foo() {
  console.log(this);
}
 
foo(); // global, because
 
var fooReference = {
  base: global,
  propertyName: 'foo'
};
 
console.log(foo === foo.prototype.constructor); // true
 
// another form of the call expression
 
foo.prototype.constructor(); // foo.prototype, because
 
var fooPrototypeConstructorReference = {
  base: foo.prototype,
  propertyName: 'constructor'
};


```

```js
function foo() {
  console.log(this.bar);
}
 
var x = {bar: 10};
var y = {bar: 20};
 
x.test = foo;
y.test = foo;
 
x.test(); // 10
y.test(); // 20
```
