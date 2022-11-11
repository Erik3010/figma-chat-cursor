import { Coordinate } from "./coordinate";

export interface CursorContext {
  id: number | string;
  isShowChatBox: boolean;
  isFocusChatBox: boolean;
  coordinate: Coordinate;
}
