import { useState, useEffect } from "react";
import Cursor from "./components/Cursor";
import { Coordinate } from "./types/coordinate";

function App() {
  const [coordinate, setCoordinate] = useState<Coordinate>({ x: 0, y: 0 });
  const [isFocusChatBox, setIsFocusChatbox] = useState(false);

  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    setCoordinate({ ...coordinate, x: clientX, y: clientY });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;

    if (key === "/") {
      event.preventDefault();

      setIsFocusChatbox(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="app">
      <div className="cursor-layer">
        <Cursor coordinate={coordinate} isFocusChatBox={isFocusChatBox} />
      </div>
      <h1>Figma Cursor</h1>
      <p className="description">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, earum
        sed. Odit nemo tempora tempore.
      </p>
    </div>
  );
}

export default App;
