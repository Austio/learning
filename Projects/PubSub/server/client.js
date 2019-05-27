const uuid = require('uuid');

class Client {
  constructor(ws) {
    this.id = uuid.v4();
    this.ws = ws;
  }

  send(message) {
    this.ws.send(message);
  }
}

exports.default = Client;
