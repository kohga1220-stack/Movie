import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { buildScenes, totalFrames } from "../config";
import { Episode } from "../episode";
import script from "./script.json";
import timing from "./timing.json";
import { SCENE_COMPONENTS } from "./scenes";
import { SCENE_CLIPS } from "./clips";

export const SCENES = buildScenes(script as Parameters<typeof buildScenes>[0], timing as Parameters<typeof buildScenes>[1]);
export const DURATION = totalFrames(SCENES);

/** 生成映像（縦長 720x1280）を重ねる。
 * Gemini の縦長の出力は、中央の帯（縦 371〜907 行）が本体で、上下は、ぼかした延長になっている（継ぎ目が見える）。
 * そのため、①全面にぼかして暗くした層、②中央の帯だけを切り出し、上下を溶かした層、の 2 枚で重ねて、継ぎ目を消す。 */
const SRC_H = 1280;
const ClipLayer: React.FC<{ src: string; bandTop?: number; bandBottom?: number }> = ({ src, bandTop, bandBottom }) => {
  const scale = 1080 / 720; // 1.5
  if (bandTop === undefined || bandBottom === undefined) {
    // 継ぎ目のないフルフレームの映像：全面に使う
    return (
      <>
        <OffthreadVideo muted src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.58 }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 560, background: "linear-gradient(180deg, rgba(10,12,18,0.82), rgba(10,12,18,0))" }} />
      </>
    );
  }
  const BAND_TOP = bandTop;
  const bandH = (bandBottom - bandTop) * scale; // 約 805px（S1-A の場合）
  const fade = "linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%)";
  return (
    <>
      <OffthreadVideo muted src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, filter: "blur(36px) brightness(0.7)" }} />
      <div style={{ position: "absolute", left: 0, width: 1080, height: bandH, top: (1920 - bandH) / 2, overflow: "hidden", opacity: 0.62, WebkitMaskImage: fade, maskImage: fade }}>
        <OffthreadVideo muted src={src} style={{ position: "absolute", left: 0, top: -BAND_TOP * scale, width: 1080, height: SRC_H * scale, objectFit: "cover" }} />
      </div>
      {/* 上の年表が、明るいページに重なっても読めるように、上を暗くする */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 560, background: "linear-gradient(180deg, rgba(10,12,18,0.82), rgba(10,12,18,0))" }} />
    </>
  );
};

const Backdrop: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, #1f2735 0%, #12151b 70%)" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
    {SCENES.filter((s) => SCENE_CLIPS[s.id]).map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.frames}>
        <ClipLayer src={staticFile(`video/ep02/${SCENE_CLIPS[s.id].file}.mp4`)} bandTop={SCENE_CLIPS[s.id].bandTop} bandBottom={SCENE_CLIPS[s.id].bandBottom} />
      </Sequence>
    ))}
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
