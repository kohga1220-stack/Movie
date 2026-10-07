import React from "react";
import { AbsoluteFill, Audio, Sequence, delayRender, continueRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FOOTER, SCENES, SceneDef, theme } from "./config";
import { Leaves, TagBadge, clamp, useProgress } from "./parts";
import { CueContext, SCENE_COMPONENTS } from "./scenes";
import { Phrase } from "./Text";
import { WorldLayer } from "./worldlayer";
import { CANVAS_H } from "./shots";
import { loadFonts } from "./fonts";

// 縦型の安全領域：上 ~190px・下 ~380px にはプラットフォームのUIが重なる
const CAPTION_TOP = 1290;

const Caption: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const f = useCurrentFrame();
  let idx = 0;
  scene.chunks.forEach((c, i) => {
    if (f >= c.startFrame) idx = i;
  });
  const local = f - scene.chunks[idx].startFrame;
  const o = f < scene.chunks[0].startFrame ? 0 : Math.min(1, Math.max(0, local / 6));
  return (
    <div
      style={{
        position: "absolute",
        top: CAPTION_TOP,
        left: 50,
        right: 50,
        minHeight: 236,
        padding: "20px 30px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: o,
      }}
    >
      <Phrase
        text={scene.chunks[idx].text}
        maxEm={16.4}
        style={{ fontFamily: theme.serif, fontSize: 54, fontWeight: 700, lineHeight: 1.5, textAlign: "center", color: theme.text, textShadow: "0 3px 10px rgba(0,0,0,0.85)" }}
      />
    </div>
  );
};

const Title: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const o = useProgress(0, 12);
  return (
    <div style={{ position: "absolute", top: 156, left: 60, right: 60, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: o }}>
      <div style={{ fontFamily: theme.serif, fontSize: 70, fontWeight: 900, textShadow: "0 4px 14px rgba(0,0,0,0.85)" }}>{scene.title}</div>
      {scene.tag && <TagBadge kind={scene.tag} delay={8} />}
    </div>
  );
};

const SceneFrame: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const f = useCurrentFrame();
  const Scene = SCENE_COMPONENTS[scene.id];
  const fade = interpolate(f, [0, 8, scene.frames - 8, scene.frames], [0, 1, 1, 0], { ...clamp });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <CueContext.Provider value={{ chunks: scene.chunks.map((c) => c.startFrame), marks: scene.marks, from: scene.from }}>
        <Scene />
      </CueContext.Provider>
      <Title scene={scene} />
      <Caption scene={scene} />
    </AbsoluteFill>
  );
};

// BGM：ナレーション中は音量を下げる（ダッキング）
const BGM_BASE = 0.4;
const BGM_DUCK = 0.15;
const windows = SCENES.flatMap((s) => s.chunks.map((c) => [s.from + c.startFrame, s.from + c.startFrame + c.frames] as const));
const bgmVolume = (f: number) => {
  let duck = 0;
  for (const [a, b] of windows) {
    duck = Math.max(duck, interpolate(f, [a - 8, a, b, b + 12], [0, 1, 1, 0], { ...clamp }));
  }
  return BGM_BASE + (BGM_DUCK - BGM_BASE) * duck;
};

/** 映画のような仕上げ：周辺減光・上下の暗部・フィルムの粒子。 */
const Grade: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 420, background: "linear-gradient(180deg, rgba(8,10,14,0.85), rgba(8,10,14,0))", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, top: CANVAS_H - 380, width: 1080, height: 380, background: "linear-gradient(180deg, rgba(8,10,14,0), rgba(8,10,14,0.92) 70%, #0b0d12)", pointerEvents: "none" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 12} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </>
  );
};

export const Ep01: React.FC = () => {
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    loadFonts().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.font, color: theme.text }}>
      <WorldLayer />
      <Grade />
      <Leaves />
      <div style={{ position: "absolute", top: 100, left: 60, right: 60, fontFamily: theme.font, fontSize: 32, fontWeight: 500, color: theme.textDim, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>歴史ショート 第1話　関ヶ原の戦い（開戦から）</div>
      {SCENES.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.frames}>
          <SceneFrame scene={scene} />
          <Audio src={staticFile("audio/sfx-hit.wav")} volume={0.5} />
          {scene.tag && (
            <Sequence from={8}>
              <Audio src={staticFile("audio/sfx-stamp.wav")} volume={0.45} />
            </Sequence>
          )}
          {scene.chunks.map((c) => (
            <Sequence key={c.file} from={c.startFrame} durationInFrames={c.frames + 6}>
              <Audio src={staticFile(c.file)} volume={1} />
            </Sequence>
          ))}
        </Sequence>
      ))}
      <Audio src={staticFile("audio/bgm.wav")} volume={bgmVolume} />
      <div style={{ position: "absolute", top: 1650, left: 60, right: 60, fontFamily: theme.font, fontSize: 26, fontWeight: 500, color: theme.textDim, textAlign: "center" }}>
        {FOOTER}　地形：標高データ（高さを強調）・軍勢はイメージ
      </div>
    </AbsoluteFill>
  );
};
