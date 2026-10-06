import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { FOOTER, SCENES, SCENE_FRAMES, SCENE_STARTS, theme } from "./config";
import { TagBadge, useProgress } from "./parts";
import { SCENE_COMPONENTS } from "./scenes";

// 縦型の安全領域：上 190px・下 ~380px にはプラットフォームのUIが重なる
const MAP_TOP = 250;
const CAPTION_TOP = 1140;

const Caption: React.FC<{ lines: string[]; total: number }> = ({ lines, total }) => {
  const f = useCurrentFrame();
  const idx = lines.length > 1 && f >= total * 0.45 ? 1 : 0;
  const local = idx === 0 ? f : f - total * 0.45;
  const o = Math.min(1, Math.max(0, local / 8));
  return (
    <div style={{ opacity: o, fontSize: 56, fontWeight: 700, lineHeight: 1.5, textAlign: "center", color: theme.text }}>
      {lines[idx]}
    </div>
  );
};

export const Ep01: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: theme.font, color: theme.text }}>
      <div style={{ position: "absolute", top: 100, left: 60, right: 60, fontSize: 34, color: theme.textDim }}>
        歴史ショート 第1話　関ヶ原の戦い（開戦から）
      </div>
      {SCENES.map((scene, i) => {
        const Scene = SCENE_COMPONENTS[scene.id];
        return (
          <Sequence key={scene.id} from={SCENE_STARTS[i]} durationInFrames={SCENE_FRAMES[i]}>
            <Title title={scene.title} tag={scene.tag} />
            <div style={{ position: "absolute", top: MAP_TOP + 60, left: 0 }}>
              <Scene />
            </div>
            <div style={{ position: "absolute", top: CAPTION_TOP + 140, left: 80, right: 80 }}>
              <Caption lines={scene.captions} total={SCENE_FRAMES[i]} />
            </div>
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", top: 1660, left: 60, right: 60, fontSize: 26, color: theme.textDim, textAlign: "center" }}>
        {FOOTER}
      </div>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ title: string; tag?: "primary" | "theory" | "legend" }> = ({ title, tag }) => {
  const o = useProgress(0, 12);
  return (
    <div style={{ position: "absolute", top: 160, left: 60, right: 60, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: o }}>
      <div style={{ fontSize: 72, fontWeight: 700 }}>{title}</div>
      {tag && <TagBadge kind={tag} delay={8} />}
    </div>
  );
};
