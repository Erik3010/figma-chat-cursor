import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useWS } from "../hooks/useWS";
import { Coordinate, CursorColor, UserCursor } from "../types";
import { EventTypes } from "../enums";
import Cursor from "./Cursor";
import ReactPortal from "./ReactPortal";
import otherCursorReducer, {
  OtherCursorsActionType,
} from "../reducers/otherCursors";
import cursorReducer, {
  CursorActionType,
  initialState,
} from "../reducers/cursor";

const CursorLayer = () => {
  const [isWSConnected, setIsWSConnected] = useState(false);

  const [cursor, dispatchCursor] = useReducer(cursorReducer, initialState);
  const [otherCursors, dispatchOtherCursor] = useReducer(
    otherCursorReducer,
    []
  );

  const allowedKeys = useRef(["/", "Escape"]);
  const chatBoxInputRef = useRef<HTMLInputElement>(null);

  const {
    connect: connectWS,
    sendMessage,
    close: closeWS,
  } = useWS({
    handleMessage,
    handleOpenConnection: () => setIsWSConnected(true),
    handleCloseConnection: () =>
      dispatchOtherCursor({
        type: OtherCursorsActionType.SET_ALL_USER,
        payload: [],
      }),
  });

  function handleMessage(event: MessageEvent) {
    const result = JSON.parse(event.data);

    switch (result.type) {
      case EventTypes.NEW_USER:
        console.log(result, cursor.id);
        handleNewUser(result.payload);
        break;
      case EventTypes.REMOVE_USER:
        console.log(result, cursor.id);
        handleRemoveUser(result.payload);
        break;
      case EventTypes.GET_USERS:
        console.log(result);
        handleGetUsers(result.payload);
        break;
      case EventTypes.COORDINATE_CHANGED:
        handleCoordinateChange(result.payload);
        break;
      case EventTypes.MESSAGE_CHANGED:
        handleMessageChange(result.payload);
        break;
    }
  }

  const handleNewUser = useCallback(
    (payload: { user_id: UserCursor["id"]; color: UserCursor["color"] }) => {
      if (payload.user_id === cursor.id) return;
      dispatchOtherCursor({
        type: OtherCursorsActionType.ADD_NEW_USER,
        // payload: payload.user_id,
        payload: { id: payload.user_id, color: payload.color },
      });
    },
    [otherCursors, cursor.id]
  );

  const handleRemoveUser = useCallback(
    (payload: { user_id: UserCursor["id"] }) => {
      dispatchOtherCursor({
        type: OtherCursorsActionType.REMOVE_USER,
        payload: payload.user_id,
      });
    },
    [otherCursors, cursor.id]
  );

  const handleCoordinateChange = useCallback(
    (payload: { user_id: UserCursor["id"]; coordinate: Coordinate }) => {
      const { user_id, coordinate } = payload;
      if (user_id === cursor.id) return;
      dispatchOtherCursor({
        type: OtherCursorsActionType.UPDATE_COORDINATE,
        payload: { id: user_id, coordinate },
      });
    },
    [otherCursors, cursor.id]
  );

  const handleMessageChange = useCallback(
    (payload: { user_id: UserCursor["id"]; message: any }) => {
      const { user_id, message } = payload;
      if (user_id === cursor.id) return;
      dispatchOtherCursor({
        type: OtherCursorsActionType.UPDATE_MESSAGE,
        payload: { id: user_id, text: message },
      });
    },
    [otherCursors, cursor.id]
  );

  const handleGetUsers = useCallback(
    (payload: { users: UserCursor[]; color: CursorColor }) => {
      dispatchOtherCursor({
        type: OtherCursorsActionType.SET_ALL_USER,
        payload: payload.users,
      });
      dispatchCursor({
        type: CursorActionType.UPDATE_CURSOR_COLOR,
        payload: payload.color,
      });
    },
    [otherCursors]
  );

  const handleTextChange = useCallback(
    (id: UserCursor["id"], value: UserCursor["text"]) => {
      if (id !== cursor.id) return;

      dispatchCursor({ type: CursorActionType.UPDATE_MESSAGE, payload: value });
      sendMessage("SET_MESSAGE", value);
    },
    [cursor.id, dispatchCursor, sendMessage]
  );

  const handleMouseMove = useCallback(
    ({ clientX, clientY }: MouseEvent) => {
      if (!isWSConnected) return;

      const coordinate = { x: clientX, y: clientY };

      dispatchCursor({
        type: CursorActionType.UPDATE_COORDINATE,
        payload: coordinate,
      });
      sendMessage("SET_COORDINATE", coordinate);
    },
    [dispatchCursor, sendMessage, isWSConnected]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;

      if (!allowedKeys.current.includes(key)) return;
      event.preventDefault();

      if (key === "/") {
        dispatchCursor({
          type: CursorActionType.OPEN_CHAT_BOX,
          payload: true,
        });
        setTimeout(() => chatBoxInputRef.current?.focus());
      } else if (key === "Escape") {
        chatBoxInputRef.current?.blur();
        dispatchCursor({ type: CursorActionType.CLOSE_CHAT_BOX });
        sendMessage("SET_MESSAGE", "");
      }
    },
    [cursor.showChatBox]
  );

  const handleExitPage = useCallback(() => {
    sendMessage("REMOVE_USER", { user_id: cursor.id });
    console.log("exit page");
  }, [cursor.id, sendMessage]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleExitPage);
    return () => {
      window.removeEventListener("beforeunload", handleExitPage);
    };
  }, [handleExitPage]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    connectWS(cursor.id);
    return () => {
      // sendMessage("REMOVE_USER", { user_id: cursorId.current });
      closeWS();
    };
  }, []);

  return (
    <ReactPortal wrapperSelector="body">
      <div className="cursor-layer">
        {otherCursors.map((cursor) => (
          <Cursor
            key={cursor.id}
            me={false}
            userCursor={cursor}
            onChangeText={handleTextChange}
          />
        ))}
        <Cursor
          onChangeText={handleTextChange}
          userCursor={cursor}
          chatBoxInputRef={chatBoxInputRef}
        />
      </div>
    </ReactPortal>
  );
};

export default CursorLayer;
