import React from "react";
import { FOOTER, SCENES } from "./config";
import { Episode } from "./episode";
import { SCENE_COMPONENTS } from "./scenes";
import { WorldLayer } from "./worldlayer";

export const Ep01: React.FC = () => (
  <Episode
    scenes={SCENES}
    sceneComponents={SCENE_COMPONENTS}
    header="歴史ショート 第1話　関ヶ原の戦い（開戦から）"
    footer={`${FOOTER}　地形：標高データ（高さを強調）・軍勢はイメージ`}
    bgm="audio/bgm.wav"
    background={<WorldLayer />}
  />
);
