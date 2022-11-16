import { ReactNode, useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
  wrapperSelector: string;
}

const ReactPortal: React.FC<Props> = ({ children, wrapperSelector }) => {
  const element = useRef(document.querySelector(wrapperSelector));
  if (!element.current) return null;

  return createPortal(children, element.current);
};

export default ReactPortal;
