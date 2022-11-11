const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 }, () => {
  console.log("socket open");
});

const users = new Set();

server.on("connection", (socket) => {
  socket.on("message", (message) => {
    const coordinate = message.toString();

    console.log(message.toString());
  });

  socket.on("close", () => {
    console.log("delete user");
  });
});
