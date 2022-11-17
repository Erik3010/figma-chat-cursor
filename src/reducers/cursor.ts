import { CURSOR_COLORS } from "../constants";
import { isEmptyString, randomId } from "../helpers";
import { CursorColor, UserCursor } from "../types";

export enum CursorActionType {
  UPDATE_COORDINATE,
  UPDATE_MESSAGE,
  OPEN_CHAT_BOX,
  UPDATE_CURSOR_COLOR,
  CLOSE_CHAT_BOX,
}

export type CursorAction =
  | {
      type: CursorActionType.UPDATE_COORDINATE;
      payload: UserCursor["coordinate"];
    }
  | {
      type: CursorActionType.UPDATE_MESSAGE;
      payload: UserCursor["text"];
    }
  | {
      type: CursorActionType.OPEN_CHAT_BOX;
      payload: UserCursor["showChatBox"];
    }
  | { type: CursorActionType.UPDATE_CURSOR_COLOR; payload: CursorColor }
  | {
      type: CursorActionType.CLOSE_CHAT_BOX;
      payload?: UserCursor["showChatBox"];
    };

export const initialState = {
  id: randomId(),
  coordinate: { x: 0, y: 0 },
  showChatBox: false,
  text: null,
  color: CURSOR_COLORS[0],
};

const reducer = (state: UserCursor, { type, payload }: CursorAction) => {
  switch (type) {
    case CursorActionType.UPDATE_COORDINATE:
      return { ...state, coordinate: payload };
    case CursorActionType.UPDATE_MESSAGE:
      // return { ...state, text: payload, showChatBox: !isEmptyString(payload) };
      return { ...state, text: payload };
    case CursorActionType.OPEN_CHAT_BOX:
      return { ...state, showChatBox: payload };
    case CursorActionType.CLOSE_CHAT_BOX:
      return { ...state, text: null, showChatBox: false };
    case CursorActionType.UPDATE_CURSOR_COLOR:
      return { ...state, color: { ...payload } };
  }
};

export default reducer;
