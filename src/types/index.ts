export interface Coordinate {
  x: number;
  y: number;
}

export interface UserCursor {
  id: string;
  showChatBox: boolean;
  isFocusChatBox: boolean;
  coordinate: Coordinate;
  text: string | null;
}
