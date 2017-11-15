### Explaining Constructor/Prototype

### History

To attract java developers, they created a way to do 

```
function Person() {
  this.firstname = 'foo'
  this.lastname = 'bar'
}

var john = new Person()
```

### Definitions
With 

 - Function Constructor: Normal function that used to make objects, returns this implicitly and is the new object
 - object.prototype.constructor: A reference to the Object constructor that created the instance, reference to the function, not the name
 