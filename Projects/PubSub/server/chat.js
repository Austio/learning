class Chat {
  constructor() {
    this.clients = new Set();
  }

  add(client) {
    this.clients.add(client);
  }

  message(serializedMessage) {
    const { sender_id, message } = this.deserialize(serializedMessage);

    this.clients.forEach(client => {
      const id = client.id === sender_id
        ? 'me:'
        : 'them:';
      client.send(`${id} ${message}`);
    });
  }

  serialize(obj) {
    if (typeof obj === 'string') {
      return obj;
    }

    return JSON.stringify(obj);
  }

  deserialize(obj) {
    if (typeof obj === 'string') {
      return JSON.parse(obj);
    }

    return obj;
  }
}

exports.default = Chat;