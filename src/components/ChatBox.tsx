import { ChangeEvent, useEffect, useRef, useCallback } from "react";

interface Props {
  cursorId: string;
  isFocus: boolean;
  me: boolean;
  isShowChatBox: boolean;
  text: string | null;
  onChangeText: (id: string, key: string, value: string | null) => void;
}

const ChatBox: React.FC<Props> = ({
  cursorId,
  isFocus,
  text,
  onChangeText,
  isShowChatBox,
  me,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChangeText(cursorId, "text", event.target.value);
    },
    [onChangeText]
  );

  useEffect(() => {
    isFocus && inputRef.current?.focus();
  }, [isFocus, inputRef.current]);

  useEffect(() => {
    // inputRef.current && inputRef.current.focus();
  }, []);

  return (
    <div className={`cursor-chat-box ${isShowChatBox ? "has-message" : ""}`}>
      <div className="cursor-chat-box-name">{me ? "Me" : cursorId}</div>
      {isShowChatBox && (
        <input
          ref={inputRef}
          value={text ?? ""}
          onChange={onChangeValue}
          type="text"
          className="cursor-chat-box-input"
          placeholder="Say something..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      )}
    </div>
  );
};

export default ChatBox;
