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

  const cursorId = useRef(randomId());
  const webSocket = useRef<WebSocket>();

  const {
    connect: connectWS,
    sendMessage,
    close: closeWS,
  } = useWS({
    handleOpenConnection: () => {},
    handleMessage,
    handleCloseConnection: () => {},
  });

  const [otherCursors, setOtherCursors] = useState<UserCursor[]>([
    // {
    //   id: randomId(),
    //   coordinate: { x: 50, y: 50 },
    //   isFocusChatBox: false,
    //   isShowChatBox: true,
    // },
    // {
    //   id: randomId(),
    //   coordinate: { x: 150, y: 150 },
    //   isFocusChatBox: false,
    //   isShowChatBox: false,
    // },
  ]);

  function handleMessage(event: MessageEvent) {
    const result = JSON.parse(event.data);
    // setOtherCursors([...otherCursors, result]);

    switch (result.type) {
      case "NEW_USER":
        if (result.payload.id !== cursorId.current) {
          setOtherCursors([...otherCursors, result.payload]);
        }
        break;
      case "REMOVE_USER":
        console.log(result);
        break;
      case "GET_USERS":
        console.log(result);
        setOtherCursors([...result.payload]);
        break;
      case "CHANGE_COORDINATE":
        const { user_id, coordinate } = result.payload;
        if (user_id !== cursorId.current) {
          const index = otherCursors.findIndex(({ id }) => id === user_id);

          const newOtherCustomer = [...otherCursors];
          newOtherCustomer[index] = { ...newOtherCustomer[index], coordinate };

          setOtherCursors(newOtherCustomer);
        }
        break;
    }
  }

  const sendAction = useCallback(
    ({ action, data }: { action: string; data: any }) => {
      webSocket.current?.send(JSON.stringify({ action, data }));
    },
    [webSocket.current]
  );

  const handleMouseMove = useCallback(
    ({ clientX, clientY }: MouseEvent) => {
      // sendAction({
      //   action: "SET_COORDINATE",
      //   data: { x: clientX, y: clientY },
      // });

      setCoordinate({ x: clientX, y: clientY });
      sendMessage("SET_COORDINATE", { x: clientX, y: clientY });
    },
    [setCoordinate, webSocket.current, sendMessage]
  );

  const allowedKeys = ["/", "Escape"];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;

      if (!allowedKeys.includes(key)) return;
      event.preventDefault();

      if (key === "/") {
        setIsFocusChatBox(true);
        setIsShowChatBox(true);
      } else if (key === "Escape") {
        setIsShowChatBox(false);
      }
    },
    [isShowChatBox, webSocket.current]
  );

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
      closeWS();
    };
  }, []);

  return (
    <div className="app">
      <div className="cursor-layer">
        {otherCursors.map((cursor) => (
          <Cursor key={cursor.id} userCursor={cursor} />
        ))}
        <Cursor
          userCursor={{
            id: cursorId.current,
            coordinate,
            isShowChatBox,
            isFocusChatBox,
          }}
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
