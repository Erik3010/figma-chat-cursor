import { useState, useEffect, useCallback, useRef } from "react";
import { Coordinate } from "./types/coordinate";
import { UserCursor } from "./types/UserCursor";
import Cursor from "./components/Cursor/Cursor";
import { randomId } from "./helpers";
import { useWS } from "./hooks/useWS";

function App() {
  const [coordinate, setCoordinate] = useState<Coordinate>({ x: 0, y: 0 });
  const [isShowChatBox, setIsShowChatBox] = useState(false);
  const [isFocusChatBox, setIsFocusChatBox] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [isWSConnected, setIsWSConnected] = useState(false);

  const cursorId = useRef(randomId());
  const webSocket = useRef<WebSocket>();
  const allowedKeys = useRef(["/", "Escape"]);
  const [otherCursors, setOtherCursors] = useState<UserCursor[]>([]);

  const {
    connect: connectWS,
    sendMessage,
    close: closeWS,
  } = useWS({
    handleOpenConnection: () => {
      setIsWSConnected(true);
    },
    handleMessage,
    handleCloseConnection: () => {
      setOtherCursors([]);
    },
  });

  const changeOtherCursorText = useCallback(
    (id: string, key: string, value: any) => {
      const newOtherCustomer = [...otherCursors];
      const index = otherCursors.findIndex((user) => user.id === id);

      newOtherCustomer[index] = { ...newOtherCustomer[index], [key]: value };

      setOtherCursors(newOtherCustomer);
    },
    [otherCursors]
  );

  function handleMessage(event: MessageEvent) {
    const result = JSON.parse(event.data);

    switch (result.type) {
      case "NEW_USER":
        console.log(result, cursorId.current);
        if (result.payload.id !== cursorId.current) {
          const newCursor = {
            id: result.payload.user_id,
            coordinate: { x: 0, y: 0 },
            isShowChatBox: false,
            isFocusChatBox: false,
            text: null,
          };
          setOtherCursors([...otherCursors, newCursor]);
        }
        break;
      case "REMOVE_USER":
        console.log(result, cursorId.current);
        setOtherCursors(
          otherCursors.filter(({ id }) => id !== result.payload.user_id)
        );
        break;
      case "GET_USERS":
        console.log(result);
        setOtherCursors([...result.payload]);
        break;
      case "COORDINATE_CHANGED":
        const { user_id, coordinate } = result.payload;
        if (user_id !== cursorId.current) {
          const index = otherCursors.findIndex(({ id }) => id === user_id);

          const newOtherCustomer = [...otherCursors];
          newOtherCustomer[index] = { ...newOtherCustomer[index], coordinate };

          setOtherCursors(newOtherCustomer);
        }
        break;
      case "MESSAGE_CHANGED":
        const { message } = result.payload;

        if (result.payload.user_id !== cursorId.current) {
          const newOtherCustomer = [...otherCursors];
          const index = otherCursors.findIndex(
            (user) => user.id === result.payload.user_id
          );

          newOtherCustomer[index] = {
            ...newOtherCustomer[index],
            isShowChatBox: message !== "",
            text: message,
          };

          setOtherCursors(newOtherCustomer);
        }
        break;
    }
  }

  const handleTextChange = useCallback(
    (id: string, value: string | null) => {
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
    [setCoordinate, webSocket.current, sendMessage, isWSConnected]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;

      if (!allowedKeys.current.includes(key)) return;
      event.preventDefault();

      if (key === "/") {
        setIsFocusChatBox(true);
        setIsShowChatBox(true);
      } else if (key === "Escape") {
        setIsShowChatBox(false);
        setIsFocusChatBox(false);
        setText("");
        sendMessage("SET_MESSAGE", "");
      }
    },
    [isShowChatBox, webSocket.current]
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
      // sendMessage("REMOVE_USER", { user_id: cursorId.current });
      closeWS();
    };
  }, []);

  return (
    <div className="app">
      <div className="cursor-layer">
        {otherCursors.map((cursor) => (
          <Cursor
            me={false}
            key={cursor.id}
            userCursor={cursor}
            onChangeText={(id: string, key: string, value: string | null) =>
              handleTextChange(id, value)
            }
          />
        ))}
        <Cursor
          me
          userCursor={{
            id: cursorId.current,
            coordinate,
            isShowChatBox,
            isFocusChatBox,
            text,
          }}
          onChangeText={(id: string, key: string, value: string | null) =>
            handleTextChange(id, value)
          }
        />
      </div>
      <h1>Figma Cursor</h1>
      <p className="description">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, earum
        sed. Odit nemo tempora tempore.
      </p>
    </div>
  );
}

export default App;
