const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 }, () => {
  console.log("socket open");
});

const users = [];

const broadcast = (data) => {
  for (const user of users) {
    user.socket.send(JSON.stringify(data));
  }
};

const setUser = (user) => {
  const index = users.findIndex(({ id }) => id === user.id);
  if (index >= 0) return;

  users.push(user);
};

server.on("connection", (socket) => {
  socket.on("message", (messageBuffer) => {
    const message = messageBuffer.toString();
    const json = JSON.parse(message);

    switch (json.action) {
      case "SET_USER":
        setUser({ ...json.data, socket });
        break;
      case "SET_COORDINATE":
        broadcast(json.data);
        break;
    }
  });

  socket.on("close", () => {
    console.log(socket);
    // users.delete()
    console.log("delete user");
  });
});
