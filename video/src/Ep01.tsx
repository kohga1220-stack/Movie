import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FOOTER, SCENES, SceneDef, theme } from "./config";
import { Leaves, TagBadge, clamp, useProgress } from "./parts";
import { CueContext, SCENE_COMPONENTS } from "./scenes";
import { Phrase } from "./Text";

// 縦型の安全領域：上 ~190px・下 ~380px にはプラットフォームのUIが重なる
const MAP_TOP = 310;
const CAPTION_TOP = 1262;

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
        minHeight: 250,
        padding: "22px 30px",
        boxSizing: "border-box",
        background: "rgba(10,12,16,0.62)",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: o,
      }}
    >
      <Phrase text={scene.chunks[idx].text} maxEm={15.4} style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.5, textAlign: "center", color: theme.text }} />
    </div>
  );
};

const Title: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const o = useProgress(0, 12);
  return (
    <div style={{ position: "absolute", top: 160, left: 60, right: 60, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: o }}>
      <div style={{ fontSize: 70, fontWeight: 700 }}>{scene.title}</div>
      {scene.tag && <TagBadge kind={scene.tag} delay={8} />}
    </div>
  );
};

const SceneFrame: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const f = useCurrentFrame();
  const Scene = SCENE_COMPONENTS[scene.id];
  const fade = interpolate(f, [0, 8, scene.frames - 8, scene.frames], [0, 1, 1, 0], { ...clamp });
  const push = interpolate(f, [0, scene.frames], [1, 1.045], { ...clamp });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Title scene={scene} />
      <div style={{ position: "absolute", top: MAP_TOP, left: 0, transform: `scale(${push})`, transformOrigin: "50% 40%" }}>
        <CueContext.Provider value={{ chunks: scene.chunks.map((c) => c.startFrame), marks: scene.marks }}>
          <Scene />
        </CueContext.Provider>
      </div>
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

export const Ep01: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, #1c2230 0%, ${theme.bg} 70%)`, fontFamily: theme.font, color: theme.text }}>
    <Leaves />
    <div style={{ position: "absolute", top: 100, left: 60, right: 60, fontSize: 34, color: theme.textDim }}>歴史ショート 第1話　関ヶ原の戦い（開戦から）</div>
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
    <div style={{ position: "absolute", top: 1640, left: 60, right: 60, fontSize: 26, color: theme.textDim, textAlign: "center" }}>{FOOTER}</div>
  </AbsoluteFill>
);
