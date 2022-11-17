export interface Coordinate {
  x: number;
  y: number;
}

export interface CursorColor {
  background: string;
  border: string;
}

export interface UserCursor {
  id: string;
  showChatBox: boolean;
  coordinate: Coordinate;
  text: string | null;
  color: CursorColor;
}

export type ChangeTextHandler = (
  id: UserCursor["id"],
  text: UserCursor["text"]
) => void;
