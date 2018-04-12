/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setupReactiveGetter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setupObject__ = __webpack_require__(2);
// References for why config directly does not work
// https://stackoverflow.com/questions/35176036/es6-exporting-module-with-a-getter




var assignedProperty = __WEBPACK_IMPORTED_MODULE_0__setupReactiveGetter__["b" /* object */].property;
var assignedFoo = __WEBPACK_IMPORTED_MODULE_1__setupObject__["b" /* myObj */].foo;

// These will not update when we change the value of object.property b/c they are not associated with the getter, just the primative
window.static = {
  fromSetupReactiveGetter: {
    importedProperty: __WEBPACK_IMPORTED_MODULE_0__setupReactiveGetter__["a" /* default */],
    assignedProperty
  },
  fromSetupObject: {
    importedFoo: __WEBPACK_IMPORTED_MODULE_1__setupObject__["a" /* default */],
    assignedFoo
  }
};

window.dynamic = {
  fromSetupReactiveGetter: {
    object: __WEBPACK_IMPORTED_MODULE_0__setupReactiveGetter__["b" /* object */]
  },
  fromSetupObject: {
    myObj: __WEBPACK_IMPORTED_MODULE_1__setupObject__["b" /* myObj */]
  }
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return object; });
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
/* harmony default export */ __webpack_exports__["a"] = (property);



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return myObj; });
var myObj = {
  foo: 'bar'
}

/* harmony default export */ __webpack_exports__["a"] = (myObj.foo);



/***/ })
/******/ ]);