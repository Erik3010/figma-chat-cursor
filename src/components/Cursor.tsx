import { ChangeTextHandler, UserCursor } from "../types";
import ChatBox from "./ChatBox";
import Pointer from "./Pointer";

interface Props {
  userCursor: UserCursor;
  me?: boolean;
  onChangeText: ChangeTextHandler;
  chatBoxInputRef?: React.Ref<HTMLInputElement>;
}

const Cursor: React.FC<Props> = ({
  userCursor,
  onChangeText,
  chatBoxInputRef,
  me = true,
}) => {
  const { id, coordinate, color } = userCursor;

  return (
    <div
      id={id}
      className="pointer-wrapper"
      style={{
        transform: `translate3d(${coordinate.x}px, ${coordinate.y}px, 0px)`,
      }}
    >
      <ChatBox
        userCursor={userCursor}
        me={me}
        onChangeText={onChangeText}
        chatBoxInputRef={chatBoxInputRef}
      />
      <Pointer color={color} />
    </div>
  );
};

export default Cursor;
