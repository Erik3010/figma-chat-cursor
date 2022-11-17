import { CursorColor } from "../types";

export const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

export const CURSOR_COLORS: CursorColor[] = [
  { background: "#1a8fa1", border: "#156f7c" },
  { background: "#eb5757", border: "#b33b3b" },
  { background: "#ee994e", border: "#be7230" },
  { background: "#3787f0", border: "#2669c0" },
  { background: "#9b51e0", border: "#7337aa" },
];

export const DEFAULT_CHAT_BOX_FONT_SIZE = 16;
