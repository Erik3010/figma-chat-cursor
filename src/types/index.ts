export interface Coordinate {
  x: number;
  y: number;
}

export interface UserCursor {
  id: string;
  showChatBox: boolean;
  coordinate: Coordinate;
  text: string | null;
}

export type ChangeTextHandler = (
  id: UserCursor["id"],
  text: UserCursor["text"]
) => void;
