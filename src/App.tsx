import { useState, useEffect, useCallback, useRef } from "react";
import { Coordinate } from "./types/coordinate";
import { UserCursor } from "./types/UserCursor";
import Cursor from "./components/Cursor/Cursor";
import { randomId } from "./helpers";

function App() {
  const [coordinate, setCoordinate] = useState<Coordinate>({ x: 0, y: 0 });
  const [isShowChatBox, setIsShowChatBox] = useState(false);
  const [isFocusChatBox, setIsFocusChatBox] = useState(false);

  const meCursorId = useRef("me");
  const webSocket = useRef<WebSocket>();

  const [otherCursors, setOtherCursors] = useState<UserCursor[]>([
    {
      id: randomId(),
      coordinate: { x: 50, y: 50 },
      isFocusChatBox: false,
      isShowChatBox: true,
    },
    {
      id: randomId(),
      coordinate: { x: 150, y: 150 },
      isFocusChatBox: false,
      isShowChatBox: false,
    },
  ]);

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
    },
    [setCoordinate, webSocket.current, sendAction]
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
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMouseMove, handleKeyDown]);

  useEffect(() => {
    // webSocket.current = new WebSocket("ws://localhost:8080");
    // console.log(webSocket.current.readyState);
    // webSocket.current.addEventListener("open", () => {
    //   console.log("connection open");
    //   sendAction({
    //     action: "SET_USER",
    //     data: {
    //       id: meCursorId.current,
    //       coordinate,
    //       isShowChatBox,
    //       isFocusChatBox,
    //     },
    //   });
    // });
    // webSocket.current.addEventListener("message", (event) => {
    //   const data = JSON.parse(event.data);
    //   console.log(data);
    // });
    // return () => {
    //   webSocket.current?.close();
    // };
  }, []);

  return (
    <div className="app">
      <div className="cursor-layer">
        {otherCursors.map((cursor) => (
          <Cursor key={cursor.id} userCursor={cursor} />
        ))}
        <Cursor
          userCursor={{ id: 123, coordinate, isShowChatBox, isFocusChatBox }}
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
