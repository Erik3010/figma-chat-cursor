import { ChangeEvent, useEffect, useRef, useCallback, useState } from "react";
import { measureTextWidth } from "../helpers";

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
  const [width, setWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputSizerRef = useRef<HTMLInputElement>(null);
  const fontSize = useRef(16);

  const onChangeValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setWidth(measureTextWidth(event.target.value, fontSize.current));
      onChangeText(cursorId, "text", event.target.value);
    },
    [onChangeText]
  );

  useEffect(() => {}, [text]);

  useEffect(() => {
    isFocus && inputRef.current?.focus();
  }, [isFocus, inputRef.current]);

  useEffect(() => {
    setWidth(measureTextWidth(text ?? "", fontSize.current));
  }, [text]);

  return (
    <div className={`cursor-chat-box ${isShowChatBox ? "has-message" : ""}`}>
      <div className="cursor-chat-box-name">{me ? "Me" : cursorId}</div>
      {isShowChatBox && (
        <div className="cursor-chat-box-wrapper">
          <span ref={inputSizerRef} className="cursor-chat-box-sizer">
            {text}
          </span>
          <input
            ref={inputRef}
            value={text ?? ""}
            onChange={onChangeValue}
            style={{ width }}
            type="text"
            className="cursor-chat-box-input"
            placeholder="Say something..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
