import { useEffect, useRef } from "react";

interface Props {
  isFocus: boolean;
}

const ChatBox: React.FC<Props> = ({ isFocus }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    isFocus && inputRef.current?.focus();
  }, [isFocus]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="cursor-chat-box"
      placeholder="Say something..."
    />
  );
};

export default ChatBox;
