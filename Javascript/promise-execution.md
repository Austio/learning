<https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html>

[https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns\#the-deferred-anti-pattern](https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern)

```js
// What do all fo these do?

// all step by step
doSomething().then(function () {
  return doSomethingElse();
}).then(finalHandler);

doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
                                     
doSomething()
  .then(function () { doSomethingElse() })
  .then(finalHandler);

doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                  finalHandler(undefined)
                  |------------------|

doSomething()
  .then(doSomethingElse())
  .then(finalHandler);

doSomething
|-----------------|
doSomethingElse(undefined)
|---------------------------------|
                  finalHandler(resultOfDoSomething)
                  |------------------|

doSomething()
  .then(doSomethingElse)
  .then(finalHandler);

doSomething
|-----------------|
                  doSomethingElse(resultOfDoSomething)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
```

Problem Using Loops with Promises

```js
// PROMLEM: Using loops with promises
// Insidious b/c it is completely dependent on how fast db.remove is
//   some conditions it will not be executed by the time you get to the .then

db.allDocs({include_docs: true}).then(function (result) {
  result.rows.forEach(function (row) {
    db.remove(row.doc);  
  });
  // returns undefined after loop does not wait for the db.remove promise
}).then(function () { // I naively believe all docs have been removed() now! 
});

// SOLUTION: Prefer promise.all
db.allDocs({include_docs: true}).then(function (result) {
  return Promise.all(result.rows.map(function (row) {
    return db.remove(row.doc);  
  });
}).then(function () { // Works!
});
```

How to Use Promises and What Happens: 3 ways

```js
// 1. return another promise
// 2. return a synchronous value (or undefined)
// 3. throw a synchronous error
getUserByName('nolan').then(function (user) {
  if (user.isLoggedOut()) {
    throw new Error('user logged out!'); // throwing a synchronous error!
  }
  if (inMemoryCache[user.id]) {
    return inMemoryCache[user.id];       // returning a synchronous value!
  }
  return getUserAccountById(user.id);    // returning a promise!
}).then(function (userAccount) {
  // I got a user account!
}).catch(function (err) {
  // Boo, I got an error!
});
```

How to use Promise.resolve() and Promise.reject()

```js
Promise.resolve(someSynchronousValue).then(/* ... */);
Promise.reject(new Error('some awful error'));
```

.catch Gotcha

```js
// catch Sugar for `.then(null,fxn)` 
// As it turns out, when you use the then(resolveHandler, rejectHandler) format, the rejectHandler won't actually catch an error if it's thrown by the resolveHandler itself.

// NOT EQUIVALIENT
somePromise().then(function () {
  throw new Error('oh noes');
}).catch(function (err) {
  // I caught your error! :)
});
  
somePromise().then(function () {
  return someOtherPromise();
}, function (err) {
  // handle error
});

somePromise().then(function () {
  throw new Error('oh noes');
}).catch(function (err) {
  // I caught your error! :)
});

somePromise().then(function () {
  throw new Error('oh noes');
}, function (err) {
  // I didn't catch your error! :(
});
```

Promises vs Promise Factory: Say you want to create a set of promises and execute sequentially

The issue is that the promise spec is that they start executing once they are created

```js
// Executes in parallel
function executeSequentially(promises) {
  var result = Promise.resolve();
  promises.forEach(function (promise) {
    result = result.then(promise);
  });
  return result;
}

// Executes in a sequence
function executeSequentially(promiseFactories) {
  var result = Promise.resolve();
  promiseFactories.forEach(function (promiseFactory) {
    result = result.then(promiseFactory);
  });
  return result;
}

// or more clear
function myPromiseFactory() {
  return somethingThatCreatesAPromise();
}
```

Promise Fall Through

```js
Promise
  .resolve('foo')
  .then(Promise.resolve('bar'))
  .then(function (result) { console.log(result) });
//Prints out 'foo' b/c when you pass a `then` a non-function (such as promise) it interprets as `.then(null)`, which causes the previous promises result to fall through.

// Probably what was meant
Promise
  .resolve('foo')
  .then(function () { return Promise.resolve('bar') })
  .then(function (result) { console.log(result) });
```





