import { ChangeTextHandler, UserCursor } from "../types";
import ChatBox from "./ChatBox";
import Pointer from "./Pointer";

interface Props {
  userCursor: UserCursor;
  me: boolean;
  isFocusChatBox?: boolean;
  onChangeText: ChangeTextHandler;
}

const Cursor: React.FC<Props> = ({
  userCursor,
  onChangeText,
  me,
  isFocusChatBox = false,
}) => {
  const { id, coordinate, showChatBox, text } = userCursor;

  return (
    <div
      id={id}
      className="pointer-wrapper"
      style={{
        transform: `translate3d(${coordinate.x}px, ${coordinate.y}px, 0px)`,
      }}
    >
      <ChatBox
        me={me}
        cursorId={id}
        text={text}
        isFocus={isFocusChatBox}
        onChangeText={onChangeText}
        showChatBox={showChatBox}
      />
      <Pointer />
    </div>
  );
};

export default Cursor;
