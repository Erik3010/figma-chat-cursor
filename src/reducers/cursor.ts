import { UserCursor } from "../types";

export enum CursorActionType {
  UPDATE_COORDINATE,
  UPDATE_MESSAGE,
}

export type CursorAction =
  | {
      type: CursorActionType.UPDATE_COORDINATE;
      payload: UserCursor["coordinate"];
    }
  | {
      type: CursorActionType.UPDATE_MESSAGE;
      payload: UserCursor["text"];
    };

const reducer = (state: UserCursor, { type, payload }: CursorAction) => {
  switch (type) {
    case CursorActionType.UPDATE_COORDINATE:
      return { ...state, coordinate: payload };
    case CursorActionType.UPDATE_MESSAGE:
      return { ...state, text: payload, showChatBox: payload !== "" };
  }
};

export default reducer;
