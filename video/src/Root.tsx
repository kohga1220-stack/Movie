import { Composition } from "remotion";
import { Ep01 } from "./Ep01";
import { DURATION, FPS, HEIGHT, WIDTH } from "./config";

export const Root = () => (
  <Composition
    id="Ep01Sekigahara"
    component={Ep01}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
