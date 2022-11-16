import { UserCursor } from "../types";

export enum OtherCursorsActionType {
  SET_ALL_USER,
  ADD_NEW_USER,
  REMOVE_USER,
  UPDATE_COORDINATE,
  UPDATE_MESSAGE,
}

export type OtherCursorAction =
  | { type: OtherCursorsActionType.SET_ALL_USER; payload: UserCursor[] }
  | { type: OtherCursorsActionType.ADD_NEW_USER; payload: UserCursor["id"] }
  | { type: OtherCursorsActionType.REMOVE_USER; payload: UserCursor["id"] }
  | {
      type: OtherCursorsActionType.UPDATE_COORDINATE;
      payload: Pick<UserCursor, "id" | "coordinate">;
    }
  | {
      type: OtherCursorsActionType.UPDATE_MESSAGE;
      payload: Pick<UserCursor, "id" | "text">;
    };

const reducer = (state: UserCursor[], { type, payload }: OtherCursorAction) => {
  switch (type) {
    case OtherCursorsActionType.SET_ALL_USER:
      return payload;
    case OtherCursorsActionType.ADD_NEW_USER:
      const newUser: UserCursor = {
        id: payload,
        coordinate: { x: 0, y: 0 },
        showChatBox: false,
        text: null,
      };
      return [...state, newUser];
    case OtherCursorsActionType.REMOVE_USER:
      return state.filter(({ id }) => id !== payload);
    case OtherCursorsActionType.UPDATE_COORDINATE:
      const { coordinate } = payload;
      return state.map((user) =>
        payload.id === user.id ? { ...user, coordinate } : user
      );
    case OtherCursorsActionType.UPDATE_MESSAGE:
      const { text } = payload;
      return state.map((user) =>
        payload.id === user.id
          ? { ...user, text, showChatBox: text !== "" }
          : user
      );
  }
};

export default reducer;
