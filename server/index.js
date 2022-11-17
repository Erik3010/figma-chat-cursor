const WebSocket = require("ws");
const url = require("url");

const port = 8080;

const users = [];

const CURSOR_COLORS = [
  { background: "#1a8fa1", border: "#156f7c" },
  { background: "#eb5757", border: "#b33b3b" },
  { background: "#ee994e", border: "#be7230" },
  { background: "#3787f0", border: "#2669c0" },
  { background: "#9b51e0", border: "#7337aa" },
];

const server = new WebSocket.Server({ port }, () => {
  console.log(`Server is listening on port ${port}`);
});

const broadcast = (payload, excludedUser) => {
  for (const user of users) {
    user.connection.send(JSON.stringify(payload));
  }
};

const setUser = (userId, color, connection) => {
  const index = users.findIndex(({ id }) => id === userId);
  if (index >= 0) return;

  users.push({
    connection,
    color,
    user_id: userId,
    coordinate: { x: 0, y: 0 },
    showChatBox: false,
    text: null,
  });
};

const setValue = (userId, key, value) => {
  const index = users.findIndex(({ user_id }) => user_id === userId);
  if (index === -1) return;

  users[index][key] = value;
};

const handleWSMessage = (userId, connection, messageBuffer) => {
  const result = JSON.parse(messageBuffer.toString());

  switch (result.type) {
    case "SET_COORDINATE":
      setValue(userId, "coordinate", result.payload);

      broadcast({
        type: "COORDINATE_CHANGED",
        payload: {
          user_id: userId,
          coordinate: result.payload,
        },
      });
      break;
    case "REMOVE_USER":
      const index = users.findIndex(
        ({ user_id }) => user_id === result.payload.user_id
      );
      users.splice(index, 1);

      broadcast({
        type: "REMOVE_USER",
        payload: { user_id: result.payload.user_id },
      });
      break;
    case "SET_MESSAGE":
      setValue(userId, "text", result.payload);
      setValue(userId, "showChatBox", result.payload !== "");

      broadcast({
        type: "MESSAGE_CHANGED",
        payload: {
          user_id: userId,
          message: result.payload,
        },
      });
      break;
  }
};

const handleWSConnection = (socket, req) => {
  console.log("WebSocket Connected");

  const { query } = url.parse(req.url, true);
  const userId = query.user_id;

  // const color = CURSOR_COLORS[users.length % CURSOR_COLORS.length];
  const color = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
  broadcast({
    type: "NEW_USER",
    payload: { user_id: userId, color },
  });
  setUser(userId, color, socket);

  const usersResponse = users
    .filter(({ user_id }) => userId !== user_id)
    .map((user) => {
      return {
        id: user.user_id,
        coordinate: user.coordinate,
        showChatBox: user.showChatBox,
        text: user.text,
        color: user.color,
      };
    });
  socket.send(
    JSON.stringify({
      type: "GET_USERS",
      payload: { users: usersResponse, color },
    })
  );

  socket.on("message", handleWSMessage.bind(this, userId, socket));
  socket.on("close", handleWSClose.bind(this, userId));
};

const handleWSClose = (userId) => {
  console.log("Connection closed");
};

server.on("connection", handleWSConnection);
