// const redis = require("redis");
//
// const redisPubSub = {
//   sub: redis.createClient(),
//   pub: redis.createClient(),
// }


class Chat {
  constructor() {
    this.clients = new Set();
  }

  add(client) {
    this.clients.add(client);
  }

  onServerMessage({ from, message }) {
  }

  onClientMessage({ from, message }) {
    this.clients.forEach(client => {
      const id = client.id === from.id
        ? 'me:'
        : 'them:';
      client.send(`${id} ${message}`);
    });
  }

  sendRandom() {
    setInterval(() => {
      i = i + 1;
      clients.forEach(client => {
        if (Date.now() % 2) {
          client.send(`${i} selected!`);
        }
      })}, 1000);

  }
}

exports.default = Chat;