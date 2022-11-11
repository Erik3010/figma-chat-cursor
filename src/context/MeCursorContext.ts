import { createContext } from "react";
import { CursorContext } from "../types/cursorContextValue";

export const MeCursorContext = createContext<CursorContext>({
  id: "me",
  isShowChatBox: false,
  isFocusChatBox: false,
  coordinate: { x: 0, y: 0 },
});
