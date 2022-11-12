const WebSocket = require("ws");
const port = 8080;

const users = [];

const server = new WebSocket.Server({ port }, () => {
  console.log(`Server is listening on port ${port}`);
});

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

const handleWSConnection = (socket) => {
  socket.on("message", handleWSMessage);
  socket.on("close", handleWSClose);
};

const handleWSMessage = (messageBuffer) => {
  const message = JSON.parse(messageBuffer.toString());

  switch (message.action) {
    case "SET_USER":
      setUser({ ...message.data, socket });
      break;
    case "SET_COORDINATE":
      broadcast(message.data);
      break;
  }
};

const handleWSClose = () => {
  console.log("Connection closed");
};

server.on("connection", handleWSConnection);
