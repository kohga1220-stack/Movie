import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Arrow, Card, Clock, Fog, MapBase, MapLabel, useProgress, useSpring } from "./parts";
import { MAP, theme } from "./config";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "relative", width: MAP.w, height: MAP.h }}>{children}</div>
);
const Overlay: React.FC<{ children: React.ReactNode; top: number }> = ({ children, top }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
    {children}
  </div>
);

export const SceneIntro: React.FC = () => {
  const a = useSpring(10);
  const b = useSpring(30);
  const fade = useProgress(0, 20);
  return (
    <Stage>
      <div style={{ opacity: fade }}>
        <MapBase roads={false} />
      </div>
      <Overlay top={0}>
        <Card delay={10} accent={theme.accent} style={{ fontSize: 52, fontWeight: 700, padding: "14px 36px", opacity: a }}>
          慶長5年9月15日
        </Card>
        <Card delay={30} style={{ fontSize: 42, padding: "12px 36px", opacity: b }}>
          新暦 1600年10月21日
        </Card>
      </Overlay>
    </Stage>
  );
};

export const SceneMorning: React.FC = () => {
  const f = useCurrentFrame();
  // 8時 → 10時 の針の動き（0〜60f は8時で保持、100〜150f で10時へ）
  const hour = interpolate(f, [100, 150], [8, 10], clamp);
  const fog = interpolate(f, [0, 30, 150, 200], [0, 0.9, 0.9, 0.1], clamp);
  const hot8 = f < 125;
  return (
    <Stage>
      <MapBase dim={0.35} showLabels={false} />
      <Fog opacity={fog} />
      <Overlay top={40}>
        <Clock hours={hour} size={460} />
        <Card delay={20} accent={hot8 ? theme.accent : theme.line} style={{ fontSize: 42 }}>
          説①　午前8時ごろ（笠谷和比古）
        </Card>
        <Card delay={50} accent={hot8 ? theme.line : theme.accent} style={{ fontSize: 42 }}>
          説②　午前10時ごろ（白峰旬）
        </Card>
      </Overlay>
    </Stage>
  );
};

export const SceneVanguard: React.FC = () => {
  const s = MAP.sekigahara;
  const pF = useProgress(30, 70);
  const pI = useProgress(110, 70);
  const label = useProgress(60, 20);
  const label2 = useProgress(140, 20);
  const src = useSpring(190);
  return (
    <Stage>
      <MapBase />
      <svg width={MAP.w} height={MAP.h} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ position: "absolute", inset: 0 }}>
        <Arrow x1={960} y1={s.y + 90} x2={640} y2={s.y + 90} p={pF} color={theme.east} />
        <Arrow x1={960} y1={s.y + 200} x2={540} y2={s.y + 200} p={pI} color={theme.east} dashed />
        <MapLabel x={960} y={s.y + 52} text="福島正則隊" size={36} anchor="end" color={theme.east} opacity={label} />
        <MapLabel x={960} y={s.y + 165} text="井伊直政隊（松平忠吉を伴う）" size={32} anchor="end" color={theme.east} opacity={label2} />
      </svg>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 20, opacity: src, fontSize: 32, color: theme.textDim, textAlign: "center" }}>
        点線＝逸話（『黒田家譜』『関ヶ原軍記大成』。江戸時代成立）
      </div>
    </Stage>
  );
};

export const SceneBetrayal: React.FC = () => {
  const m = MAP.matsuo;
  const p = useProgress(40, 60);
  const lab = useProgress(30, 20);
  return (
    <Stage>
      <MapBase hotMatsuo showLabels={false} />
      <svg width={MAP.w} height={MAP.h} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ position: "absolute", inset: 0 }}>
        <MapLabel x={m.x} y={m.y + 150} text="松尾山" />
        <Arrow x1={m.x + 20} y1={m.y - 120} x2={m.x + 150} y2={m.y - 300} p={p} color={theme.west} />
        <MapLabel x={m.x + 200} y={m.y - 180} text="寝返り" size={52} anchor="start" color={theme.west} opacity={lab} />
      </svg>
      <Overlay top={20}>
        <Card delay={70} accent={theme.accent} style={{ fontSize: 38 }}>
          小早川秀秋・脇坂安治・小川祐忠父子ら
        </Card>
        <Card delay={110} style={{ fontSize: 36 }}>
          「うらきり」<br />
          <span style={{ fontSize: 30, color: theme.textDim }}>9月17日付 石川康通・彦坂元正連署書状</span>
        </Card>
      </Overlay>
    </Stage>
  );
};

export const SceneShots: React.FC = () => {
  const q = useSpring(0);
  return (
    <Stage>
      <MapBase dim={0.25} showLabels={false} />
      <Overlay top={0}>
        <div style={{ fontSize: 220, fontWeight: 700, color: theme.accent, opacity: q, lineHeight: 1 }}>？</div>
        <Card delay={20} style={{ width: "100%", fontSize: 40 }}>
          『黒田家譜』<br />
          家康の指示で、福島正則隊が銃撃
        </Card>
        <Card delay={50} style={{ width: "100%", fontSize: 40 }}>
          『井伊家慶長記』<br />
          家康ではなく、藤堂高虎が自身の判断で銃撃
        </Card>
      </Overlay>
    </Stage>
  );
};

export const SceneEnd: React.FC = () => {
  const f = useCurrentFrame();
  const hour = interpolate(f, [10, 60], [10, 12], clamp);
  return (
    <Stage>
      <MapBase dim={0.2} showLabels={false} />
      <Overlay top={0}>
        <Clock hours={hour} size={300} />
        <Card delay={30} accent={theme.accent} style={{ width: "100%", fontSize: 36 }}>
          9月15日　午の刻（正午ごろ）に戦闘終了<br />
          <span style={{ fontSize: 30, color: theme.textDim }}>軍記には午後2時ごろとするものもある</span>
        </Card>
        <Card delay={60} style={{ width: "100%", fontSize: 36 }}>
          10月1日（旧暦）　六条河原で斬首<br />
          <span style={{ fontSize: 30, color: theme.textDim }}>安国寺恵瓊・小西行長・石田三成</span>
        </Card>
        <Card delay={90} style={{ width: "100%", fontSize: 32, color: theme.textDim, padding: "16px 36px" }}>
          当日の記録は、ほとんどが後世の史料です
        </Card>
      </Overlay>
    </Stage>
  );
};

export const SCENE_COMPONENTS: Record<string, React.FC> = {
  intro: SceneIntro,
  morning: SceneMorning,
  vanguard: SceneVanguard,
  betrayal: SceneBetrayal,
  shots: SceneShots,
  end: SceneEnd,
};
