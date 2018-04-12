var object = {};

function random() {
  return Math.random();
}

var value = 5;

// Define reactive getter/setter on object
Object.defineProperty(object, 'property', {
  get() {
    return 'Value: ' + value + ' Random:' + random();
  },

  set(newVal) {
    value = newVal;
  }
});

// When we assign the property variable here it is the value of the object.property, which is a string
var property = object.property;
export default property;

export {
  object
}