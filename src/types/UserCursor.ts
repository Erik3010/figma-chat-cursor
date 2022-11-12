import { Coordinate } from "./coordinate";

export interface UserCursor {
  id: number | string;
  isShowChatBox: boolean;
  isFocusChatBox: boolean;
  coordinate: Coordinate;
}
