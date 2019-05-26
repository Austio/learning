const http = require('http');
const WEB_SOCK_PORT = 1337;
const WEB_PORT = 8080;
const fs = require('fs');
var server = http.createServer(function (req, res) {
  const file = fs.readFile(__dirname + '/index.html', function (err, f){
    if (err) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(f)
    res.end()
  })
})
server.listen(WEB_PORT);

const WebSocket = require('ws');
const wss = new WebSocket.Server({
  port: WEB_SOCK_PORT
})

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

var i = 0;
var clients = [];

setInterval(() => {
  i = i + 1;
  clients.forEach(client => {
    if (Date.now() % 2) {
      client.send(`${i} selected!`);
    }
  })}, 1000);


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  clients.push(ws);
});