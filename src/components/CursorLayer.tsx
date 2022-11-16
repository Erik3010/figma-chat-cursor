import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { randomId } from "../helpers";
import { useWS } from "../hooks/useWS";
import { Coordinate, UserCursor } from "../types";
import { EventTypes } from "../enums";
import Cursor from "./Cursor";
import ReactPortal from "./ReactPortal";
import otherCursorReducer, {
  OtherCursorsActionType,
} from "../reducers/otherCursors";

const CursorLayer = () => {
  const [coordinate, setCoordinate] = useState<Coordinate>({ x: 0, y: 0 });
  const [showChatBox, setShowChatBox] = useState(false);
  const [isFocusChatBox, setIsFocusChatBox] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [isWSConnected, setIsWSConnected] = useState(false);
  const [otherCursors, dispatchOtherCursor] = useReducer(
    otherCursorReducer,
    []
  );

  const cursorId = useRef(randomId());
  const allowedKeys = useRef(["/", "Escape"]);

  const {
    connect: connectWS,
    sendMessage,
    close: closeWS,
  } = useWS({
    handleMessage,
    handleOpenConnection: () => setIsWSConnected(true),
    // handleCloseConnection: () => setOtherCursors([]),
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
        console.log(result, cursorId.current);
        handleNewUser(result.payload);
        break;
      case EventTypes.REMOVE_USER:
        console.log(result, cursorId.current);
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
    (payload: { user_id: UserCursor["id"] }) => {
      if (payload.user_id === cursorId.current) return;
      dispatchOtherCursor({
        type: OtherCursorsActionType.ADD_NEW_USER,
        payload: payload.user_id,
      });
    },
    [otherCursors]
  );

  const handleRemoveUser = useCallback(
    (payload: { user_id: UserCursor["id"] }) => {
      dispatchOtherCursor({
        type: OtherCursorsActionType.REMOVE_USER,
        payload: payload.user_id,
      });
    },
    [otherCursors]
  );

  const handleCoordinateChange = useCallback(
    (payload: { user_id: UserCursor["id"]; coordinate: Coordinate }) => {
      const { user_id, coordinate } = payload;
      if (user_id === cursorId.current) return;
      dispatchOtherCursor({
        type: OtherCursorsActionType.UPDATE_COORDINATE,
        payload: { id: user_id, coordinate },
      });
    },
    [otherCursors]
  );

  const handleMessageChange = useCallback(
    (payload: { user_id: UserCursor["id"]; message: any }) => {
      const { user_id, message } = payload;
      if (user_id === cursorId.current) return;
      dispatchOtherCursor({
        type: OtherCursorsActionType.UPDATE_MESSAGE,
        payload: { id: user_id, text: message },
      });
    },
    [otherCursors]
  );

  const handleGetUsers = useCallback(
    (payload: UserCursor[]) => {
      dispatchOtherCursor({
        type: OtherCursorsActionType.SET_ALL_USER,
        payload,
      });
    },
    [otherCursors]
  );

  const handleTextChange = useCallback(
    (id: UserCursor["id"], value: UserCursor["text"]) => {
      if (id !== cursorId.current) return;

      setText(value);
      sendMessage("SET_MESSAGE", value);
    },
    [cursorId.current, setText, sendMessage]
  );

  const handleMouseMove = useCallback(
    ({ clientX, clientY }: MouseEvent) => {
      if (!isWSConnected) return;

      setCoordinate({ x: clientX, y: clientY });
      sendMessage("SET_COORDINATE", { x: clientX, y: clientY });
    },
    [setCoordinate, sendMessage, isWSConnected]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;

      if (!allowedKeys.current.includes(key)) return;
      event.preventDefault();

      if (key === "/") {
        setIsFocusChatBox(true);
        setShowChatBox(true);
      } else if (key === "Escape") {
        setShowChatBox(false);
        setIsFocusChatBox(false);
        setText("");
        sendMessage("SET_MESSAGE", "");
      }
    },
    [showChatBox]
  );

  const handleExitPage = useCallback(() => {
    sendMessage("REMOVE_USER", { user_id: cursorId.current });
    console.log("EXIT PAGE");
  }, [sendMessage]);

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
    connectWS(cursorId.current);
    return () => {
      //   sendMessage("REMOVE_USER", { user_id: cursorId.current });
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
          me
          isFocusChatBox={isFocusChatBox}
          onChangeText={handleTextChange}
          userCursor={{
            id: cursorId.current,
            coordinate,
            showChatBox,
            text,
          }}
        />
      </div>
    </ReactPortal>
  );
};

export default CursorLayer;
