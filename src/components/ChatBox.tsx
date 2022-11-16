import { ChangeEvent, useEffect, useRef, useCallback, useState } from "react";
import { measureTextWidth } from "../helpers";
import { ChangeTextHandler } from "../types";

interface Props {
  cursorId: string;
  isFocus: boolean;
  me: boolean;
  showChatBox: boolean;
  text: string | null;
  onChangeText: ChangeTextHandler;
}

const ChatBox: React.FC<Props> = ({
  cursorId,
  isFocus,
  text,
  onChangeText,
  showChatBox,
  me,
}) => {
  const [width, setWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputSizerRef = useRef<HTMLInputElement>(null);
  const fontSize = useRef(16);

  const onChangeValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setWidth(measureTextWidth(event.target.value, fontSize.current));
      onChangeText(cursorId, event.target.value);
    },
    [onChangeText]
  );

  useEffect(() => {
    isFocus && inputRef.current?.focus();
  }, [isFocus, inputRef.current]);

  useEffect(() => {
    setWidth(measureTextWidth(text ?? "", fontSize.current));
  }, [text]);

  return (
    <div className={`cursor-chat-box ${showChatBox ? "has-message" : ""}`}>
      <div className="cursor-chat-box-name">{me ? "Me" : cursorId}</div>
      {showChatBox && (
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
