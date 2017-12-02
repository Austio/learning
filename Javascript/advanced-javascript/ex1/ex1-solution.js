(function (global) {
///////////////////////////////////////////////////////////////////////////////
'use strict'

function C () {
	console.log('OOPS!')
}

function E (f) {
	console.log('E')
	f()
	var f = F
}

var A = function () {
	console.log('A')
	B()
}

var C

function G () {
	console.log('G')
	H()

	function H () {
		console.log('H')
		I()
	}
}

var D = d;

function d () {
	console.log('D')
	E(F)
}

function I () {
	console.log('I')
	J()
	J()
}

function B () {
	console.log('B')
	C()
}

function F () {
	console.log('F')
	G()
}

var rest = 'KLMNOPQRSTUVWXYZ'.split('')
for (var i=0; i<rest.length; i++) {
  (function (i){
	  // define the current function
	  global[rest[i]] = function () {
		  console.log(rest[i])
		  if (i < (rest.length-1)) {
			  // TODO: call the next function
			  global[rest[i + 1]]()
		  }
	  }
  })(i)
}

A()

function J () {
	J = function() {
		console.log('J')
		global.K()
	}
	return J
}

function C () {
	console.log('C')
	d()
}
///////////////////////////////////////////////////////////////////////////////
})({})
