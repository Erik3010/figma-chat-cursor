import { useContext } from "react";
import { MeCursorContext } from "../../context/MeCursorContext";
import Cursor from "./Cursor";

const MeCursor = () => {
  const { coordinate, isShowChatBox, isFocusChatBox, id } =
    useContext(MeCursorContext);

  return (
    <Cursor
      id={id}
      coordinate={coordinate}
      isShowChatBox={isShowChatBox}
      isFocusChatBox={isFocusChatBox}
    />
  );
};

export default MeCursor;
