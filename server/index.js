const WebSocket = require("ws");
const url = require("url");

const port = 8080;

const users = [];

const server = new WebSocket.Server({ port }, () => {
  console.log(`Server is listening on port ${port}`);
});

const broadcast = (payload, excludedUser) => {
  for (const user of users) {
    // if (user.user_id === excludedUser) continue;
    user.connection.send(JSON.stringify(payload));
    // user.socket.send(JSON.stringify(payload));
  }
};

const setUser = (userId, connection) => {
  const index = users.findIndex(({ id }) => id === userId);
  if (index >= 0) return;

  // users.push({
  //   socket,
  //   id: userId,
  //   isShowChatBox: false,
  //   isFocusChatBox: false,
  //   coordinate: { x: 0, y: 0 },
  // });

  users.push({
    connection,
    user_id: userId,
    coordinate: { x: 0, y: 0 },
    isShowChatBox: false,
    isFocusChatBox: false,
    text: null,
  });
};

const setCoordinate = (userId, payload) => {
  const index = users.findIndex(({ user_id }) => user_id === userId);
  if (index === -1) return;

  users[index].coordinate = payload;
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
      // setCoordinate(userId, result.payload);
      setValue(userId, "coordinate", result.payload);

      // const others = users
      //   .filter(({ user_id }) => user_id !== userId)
      //   .map((user) => {
      //     return {
      //       id: user.user_id,
      //       coordinate: user.coordinate,
      //       isShowChatBox: user.isShowChatBox,
      //       isFocusChatBox: user.isFocusChatBox,
      //     };
      //   });
      // broadcast(others, userId);
      broadcast({
        type: "COORDINATE_CHANGED",
        payload: {
          user_id: userId,
          coordinate: result.payload,
        },
      });
      break;
    case "GET_USERS":
      // const users = users.map((user) => {
      //   return {
      //     id: user.user_id,
      //     coordinate: user.coordinate,
      //     isShowChatBox: user.isShowChatBox,
      //     isFocusChatBox: user.isFocusChatBox,
      //   };
      // });
      // socket.send(JSON.stringify(users));
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

  broadcast({
    type: "NEW_USER",
    payload: { user_id: userId },
  });
  setUser(userId, socket);

  const usersResponse = users
    .filter(({ user_id }) => userId !== user_id)
    .map((user) => {
      return {
        id: user.user_id,
        coordinate: user.coordinate,
        isShowChatBox: user.isShowChatBox,
        isFocusChatBox: user.isFocusChatBox,
        text: user.text,
      };
    });
  socket.send(JSON.stringify({ type: "GET_USERS", payload: usersResponse }));

  socket.on("message", handleWSMessage.bind(this, userId, socket));
  socket.on("close", handleWSClose.bind(this, userId));
};

const handleWSClose = (userId) => {
  console.log("Connection closed");
};

server.on("connection", handleWSConnection);
