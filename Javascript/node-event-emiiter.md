```js
// From Scratch

function Emitter() {
  this.events = {};
}

// on pushes a listener into an arra
Emitter.prototype.on = function(type, listener) {
  this.events[type] = this.events[type] || [];
  this.events[type].push(listener)
}

Emitter.prototype.emit = function(type) {
  if (this.events[type]) {
    this.events[type].forEach(listener, listener())
  }
}

module.exports = Emitter;


a = new Emitter()
a.on('foo', function barFunc() { console.log('barFunc') })
a.on('foo', function bazFunc() { console.log('bazFunc') })
// now
// a.events['foo'] = [barFunc]

a.emit('foo')
// logs barFunc and bazFunc
```

# Node Event Emitter
Is just a way more fancy version fo this that handles arguments, memory leaks, etc

#### Magic String Problem
When you rely on strings for basic of logic of code, it is bad b/c mispelling causes havoc and super hard to track down, instead use constants

# Streams
Def: Sequest of data made available over time, pieces that eventually combine into a whole.  Think stream a movie
Most of the time we compile a stream into a buffer and then when it is ready it will continue

In Node => Data in a stream that is combined in a buffer to make ready and send

### Chunk
Piece of data being sent through a stream (data split to chunks and streamed)

### Pipes
Connecting to streams by writing to one stream that is being read from another, in Node you pipe a readable to a writable

```js
// Stream, assumes a file called greet.txt that is largish
var fs = require('fs')

// Read from greet, convert to utf8 text and do it max of 1kb at a time
var readable = fs.createReadStream(__dirname + '/greet.txt', { encoding: 'utf8', highWaterMark: 1024 })
var writable = fs.createWriteStream(__dirname + '/greetCopy.txt')

// readable processes chunks of 1kb, as they are ready emits 'data' and the writable gets the chunk sent to it
readable.on('data', function(chunk) {
  writable.write(chunk)
})

// Setup with pipes
readable.pipe(writable)


```
