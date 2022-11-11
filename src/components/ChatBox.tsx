import { useEffect, useRef } from "react";

interface Props {
  isFocus: boolean;
}

const ChatBox: React.FC<Props> = ({ isFocus }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    isFocus && inputRef.current?.focus();
  }, [isFocus]);

  useEffect(() => {
    // inputRef.current && inputRef.current.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      className="cursor-chat-box"
      placeholder="Say something..."
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
    />
  );
};

export default ChatBox;
