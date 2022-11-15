import { useCallback, useEffect, useRef, useState } from "react";
import { WEBSOCKET_URL } from "../consants";

export const useWS = ({
  handleOpenConnection,
  handleMessage,
  handleCloseConnection,
}: {
  handleOpenConnection: (event: Event) => void;
  handleMessage: (event: MessageEvent<any>) => void;
  handleCloseConnection: (event: Event) => void;
}) => {
  const [ws, setWS] = useState<WebSocket | null>(null);

  const connect = useCallback((userId: string) => {
    const url = `${WEBSOCKET_URL}?user_id=${userId}`;
    const webSocket = new WebSocket(url);
    setWS(webSocket);
  }, []);

  const sendMessage = useCallback(
    (type: string, payload: any) => {
      ws?.send(JSON.stringify({ type, payload }));
    },
    [ws]
  );

  const close = useCallback(() => {
    if (ws?.readyState !== ws?.OPEN) return;
    console.log(ws?.close);
    ws?.close();
  }, [ws]);

  useEffect(() => {
    if (!ws) return;
    ws.addEventListener("open", handleOpenConnection);

    return () => {
      ws.removeEventListener("open", handleOpenConnection);
    };
  }, [ws, handleOpenConnection]);

  useEffect(() => {
    if (!ws) return;
    ws.addEventListener("message", handleMessage);

    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws, handleMessage]);

  useEffect(() => {
    if (!ws) return;
    ws.addEventListener("close", handleCloseConnection);

    return () => {
      ws.removeEventListener("close", handleCloseConnection);
    };
  }, [ws, handleCloseConnection]);

  return { connect, sendMessage, close };
};
