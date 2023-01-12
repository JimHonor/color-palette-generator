import { css } from "@emotion/react";
import { useRef, useState } from "react";

import { getPalette } from "./js/palette";

const App = () => {
  const fileRef = useRef(null);

  const [palette, setPalette] = useState([]);

  const onGetPalette = () => {
    getPalette({ imgFile: fileRef.current, canvasId: "canvas" }, (result) => {
      setPalette(result);
    });
  };

  return (
    <div
      className="App"
      css={css`
        padding: 1rem;
      `}
    >
      <input type="file" ref={fileRef} />
      <canvas id="canvas"></canvas>
      <button onClick={onGetPalette}>click</button>
      <div>
        {palette.map((color, index) => (
          <div
            key={index}
            style={{ backgroundColor: `#${color.value}` }}
            css={css`
              display: flex;
              justify-content: space-between;
            `}
          >
            <span>#{index + 1}</span>
            <span>#{color.value}</span>
            <span>{color.percentage}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
