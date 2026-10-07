import { Composition } from "remotion";
import { Ep01 } from "./Ep01";
import { DURATION as DURATION02, Ep02 } from "./ep02/Ep02";
import { DURATION, FPS, HEIGHT, WIDTH } from "./config";

export const Root = () => (
  <>
  <Composition
    id="Ep01Sekigahara"
    component={Ep01}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
  <Composition id="Ep02Behaviorism" component={Ep02} durationInFrames={DURATION02} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
