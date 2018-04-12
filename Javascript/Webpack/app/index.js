// References for why config directly does not work
// https://stackoverflow.com/questions/35176036/es6-exporting-module-with-a-getter

import property, { object } from './setupReactiveGetter';

console.log('opened');

var byValueProperty = object.property;

// These will not update when we change the value of object.property b/c they are not associated with the getter, just the primative
window.static = {
  property,
  byValueProperty
}

window.dynamic = object;
