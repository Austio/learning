## Webpack Code Splitting Performance

### Top 3 Web Page Load Time Causes
 - Amount of Javascript for initial download
  - by caching you only get network cost
  - eval and execute is something people ignore, this can be costly 
 - Amount of CSS for initial download
 - Amount of network requests on initial download

### Goals

 = 200kb (uncompressed) Initial Javascript [TOTAL]
 = 100kb (uncompressed) Initial CSS [TOTAL]
 = http: <= 6 Initial Network Calls
 = http2 <= 20 initial Network Calls
 = 90% Code Coverage (10% Code Unused)
   - CTL+p search for coverage to find unused/used things

### APIs
 mode -
   - lazy: lazy loadable chunks for each import
   - lazy-once: Generates a single lazy loadable chunk for all calls to imports that will be fetched on the first call to import.  Subsequent calls will use the same 
 magic comments:
  - "webpackPrefetch" - pull in the code link with prefetch (link rel=prefetch)
  - "webpackPreload" - pull in code link with preload (link rel=preload)
   
### Code Splitting
 One downside of code splitting is that you cannot treeshake the bundle.

 - Splitting Pieces of Code into Async Chunks

 Code Splitting is a different type of dependency 
 
 Static Import
  - Heavy Javascript
  - Anything Temporal (appears and goes away)
  - Routes
  
 Dynamic: 
  - Returns promise
  - Good for A/B Tests
 
```js
import Listener from './listeners.js';

const getModal = () => import('./src/modal.js');

listener.on('loadModal', () => {
  getModal().then((module) => {
    const modalTarget = document.getElementById('Modal');
    module.initModal(modalTarget);
  });
});

``` 

// Use runtime condition to load
```js 
// Partial Path is the `./src/theme`
// Expression it the interpolation ${themeName}

const getTheme = (themeName) => import(`./src/themes/${themeName}`);
const button = makeButton("Yay! A Button!");
 
button.addEventListener("click", e => {
  getTheme("red").then(style => {
    button.style = style.default;
  });
});

```

### Internals

(Set This to mode: "none")[https://github.com/TheLarkInn/webpack-workshop-2018/blob/4de3c04d0ffcb7bb44741ff3fb6eabc1c606df4b/webpack.config.js#L3]

Webpack loads with this call, which sets the import of 1 in module cache
```js
// import { footer } from "./footer";
const getFooter = () => __webpack_require__.e(/* import() */ 1).then(__webpack_require__.bind(null, 10));
```

Webpack loads with bundle and .e function
```js
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var head = document.getElementsByTagName('head')[0];
/******/ 				var script = document.createElement('script');
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				function onScriptComplete(event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
```



### AntiPatterns

Vendors is considered an amount