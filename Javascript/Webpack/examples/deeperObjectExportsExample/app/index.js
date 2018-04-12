// References for why config directly does not work
// https://stackoverflow.com/questions/35176036/es6-exporting-module-with-a-getter

import property, { object } from './setupReactiveGetter';
import foo, { myObj } from './setupObject';

var assignedProperty = object.property;
var assignedFoo = myObj.foo;

// These will not update when we change the value of object.property b/c they are not associated with the getter, just the primative
window.static = {
  fromSetupReactiveGetter: {
    importedProperty: property,
    assignedProperty
  },
  fromSetupObject: {
    importedFoo: foo,
    assignedFoo
  }
};

window.dynamic = {
  fromSetupReactiveGetter: {
    object
  },
  fromSetupObject: {
    myObj
  }
};
