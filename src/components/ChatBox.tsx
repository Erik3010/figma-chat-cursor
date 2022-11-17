import { ChangeEvent, useEffect, useRef, useCallback, useState } from "react";
import { DEFAULT_CHAT_BOX_FONT_SIZE as fontSize } from "../constants";
import { measureTextWidth } from "../helpers";
import { ChangeTextHandler, UserCursor } from "../types";

interface Props {
  me: boolean;
  onChangeText: ChangeTextHandler;
  userCursor: UserCursor;
  chatBoxInputRef?: React.Ref<HTMLInputElement>;
}

const ChatBox: React.FC<Props> = ({
  onChangeText,
  me,
  userCursor,
  chatBoxInputRef,
}) => {
  const { id, text, showChatBox, color } = userCursor;

  const [width, setWidth] = useState(0);
  const [isEnter, setIsEnter] = useState(false);
  const [tempText, setTempText] = useState<string | null>(null);
  const inputSizerRef = useRef<HTMLInputElement>(null);

  const onChangeValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setWidth(measureTextWidth(event.target.value, fontSize));
      onChangeText(id, event.target.value);
    },
    [onChangeText]
  );

  useEffect(() => {
    setWidth(measureTextWidth(text ?? "", fontSize));
  }, [text]);

  const handleOnInput = (event: React.KeyboardEvent) => {
    const { key } = event;

    if (key !== "Enter") {
      if (!isEnter) return;

      const inputSizer = inputSizerRef.current;
      inputSizer?.classList.add("animate-up");

      inputSizer?.addEventListener("animationend", (event) => {
        const el = event.target as HTMLElement;

        el?.classList.remove("visible");
        el?.classList.remove("animate-up");

        setTempText(null);
        setIsEnter(false);
      });

      return;
    }

    if (isEnter) return;

    setTempText(text);
    onChangeText(id, "");
    inputSizerRef.current?.classList.add("visible");
    setIsEnter(true);
  };

  return (
    <div
      className={`cursor-chat-box ${showChatBox ? "has-message" : ""}`}
      style={{ background: color.background, borderColor: color.border }}
    >
      <div className="cursor-chat-box-name">{me ? "Me" : id}</div>
      {showChatBox && (
        <div className="cursor-chat-box-wrapper">
          <span ref={inputSizerRef} className={`cursor-chat-box-sizer`}>
            {isEnter ? tempText : text}
          </span>
          <input
            ref={chatBoxInputRef}
            value={text ?? ""}
            onChange={onChangeValue}
            style={{ width }}
            type="text"
            className="cursor-chat-box-input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            onKeyDown={handleOnInput}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
