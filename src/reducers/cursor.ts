import { isEmptyString, randomId } from "../helpers";
import { UserCursor } from "../types";

export enum CursorActionType {
  UPDATE_COORDINATE,
  UPDATE_MESSAGE,
  UPDATE_SHOW_CHAT_BOX,
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
      type: CursorActionType.UPDATE_SHOW_CHAT_BOX;
      payload: UserCursor["showChatBox"];
    };

export const initialState = {
  id: randomId(),
  coordinate: { x: 0, y: 0 },
  showChatBox: false,
  text: null,
};

const reducer = (state: UserCursor, { type, payload }: CursorAction) => {
  switch (type) {
    case CursorActionType.UPDATE_COORDINATE:
      return { ...state, coordinate: payload };
    case CursorActionType.UPDATE_MESSAGE:
      return { ...state, text: payload, showChatBox: !isEmptyString(payload) };
    case CursorActionType.UPDATE_SHOW_CHAT_BOX:
      return { ...state, showChatBox: payload };
  }
};

export default reducer;
