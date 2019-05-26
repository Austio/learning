const http = require('http');
const WEB_SOCK_PORT = 1337;
const WEB_PORT = 8080;
const fs = require('fs');
const crypto = require('crypto');

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