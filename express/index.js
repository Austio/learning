const app = require('express')();

let exec = 0;
let settimeout = 0;
let promise = 0;
let block = 0;

app.get('/exec', (req, res, next) => {
  console.info('exec - ' + exec);
  exec++;
  res.status(200).send('exec').end();
});

app.get('/settimeout', (req, res, next) => {
  console.info('settimeout - ' + settimeout);
  settimeout++;
  setTimeout(function() {
    res.status(200).send('settimeout').end();
  }, 0);
});


app.get('/settimeout', (req, res, next) => {
  console.info('settimeout - ' + settimeout);
  settimeout++;
  res.status(200).send('settimeout').end();
});

app.get('/promise', (req, res, next) => {
  Promise.resolve().then(() => fetch('http://google.com'))
    .then(t => {
      console.info('promise - ' + promise);
      promise++;
      res.status(200).send('promise').end();
    })
    .catch(t => {
      console.info('promise - ' + promise);
      promise++;
      res.status(404).send('promise').end();
    });
});

app.get('/block', (req, res) => {
  console.log("blocking for a while")
  for(let i = 0; i <= 1000000000; i++){}
  promise++;
  res.status(200).send('block').end();
})

app.listen(3001);