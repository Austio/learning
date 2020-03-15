const Table = require('./database').Table;

const t = new Table();
t.createIndex('indexedName');

for(let i = 0; i < 1000000; i++) {
  t.insert({ name: i, indexedName: i })
}

function measure(name, func) {
  console.time(name);
  func();
  console.timeEnd(name);
}

measure('non indexed lookup', () => {
  t.findBy('name', 5);
});


measure('indexed lookup', () => {
  t.findBy('indexedName', 5);
});

