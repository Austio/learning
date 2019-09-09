### Module Formats

##### Revealing Module
```js
function calculateScore() {}
return {
  calculateScore,
}
```

##### AMD
```js
define(["./player"], function(player) {
  function calculateScore() {}
  
  return {
    calculateScore
  }
});
```

##### CommonJS

 - module.exports === exports
 - `exports.calculateScore = calculateScore` is same as `module.exports.calculateScore = calculateScore`
 - don't do these things b/c it assigns a new object
  - `exports = {}`
  - `exports = function(){}`
 - use `module.exports={}` or `module.exports = function(){}` 

```js 
var player = require('./player');

function calculateScore() {}

exports.calculateScore = calculateScore;
```

UMD
System.register
ES2015 - Native Format