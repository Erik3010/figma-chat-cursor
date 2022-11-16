import { UserCursor } from "../../types";
import ChatBox from "../ChatBox";

interface Props {
  userCursor: UserCursor;
  onChangeText: (index: string, key: string, value: string | null) => void;
  me: boolean;
}

const Cursor: React.FC<Props> = ({ userCursor, onChangeText, me }) => {
  const { id, coordinate, showChatBox, isFocusChatBox, text } = userCursor;

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
      <svg
        className="pointer"
        width={35}
        height={35}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 35 35"
      >
        <g fill="rgba(0,0,0,.2)">
          <path
            d="M12 24.422V8.407l11.591 11.619H16.81l-.411.124z"
            transform="translate(1 1)"
          ></path>
          <path
            d="M21.084 25.096l-3.605 1.535-4.682-11.089 3.686-1.553z"
            transform="translate(1 1)"
          ></path>
        </g>
        <g fill="#fff">
          <path d="M12 24.422V8.407l11.591 11.619H16.81l-.411.124z"></path>
          <path d="M21.084 25.096l-3.605 1.535-4.682-11.089 3.686-1.553z"></path>
        </g>
        <g fill="#156f7c">
          <path d="M19.751 24.416l-1.844.774-3.1-7.374 1.841-.775z"></path>
          <path d="M13 10.814v11.188l2.969-2.866.428-.139h4.768z"></path>
        </g>
      </svg>
    </div>
  );
};

export default Cursor;
