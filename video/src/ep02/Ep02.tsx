import React from "react";
import { buildScenes, totalFrames } from "../config";
import { Episode } from "../episode";
import script from "./script.json";
import timing from "./timing.json";
import { SCENE_COMPONENTS } from "./scenes";

export const SCENES = buildScenes(script as Parameters<typeof buildScenes>[0], timing as Parameters<typeof buildScenes>[1]);
export const DURATION = totalFrames(SCENES);

const Backdrop: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, #1f2735 0%, #12151b 70%)" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
  </div>
);

export const Ep02: React.FC = () => (
  <Episode
    scenes={SCENES}
    sceneComponents={SCENE_COMPONENTS}
    header="心理学の歴史 第2話　行動主義と新行動主義"
    footer="出典：原典・論文・教科書（概要欄）　図は概念図"
    bgm="audio/ep02/bgm.wav"
    background={<Backdrop />}
    tagLabels={{ primary: "原典", theory: "諸説", legend: "要確認" }}
  />
);
