import React, { createContext, useContext } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Arrow, Clock, Flag, Fog, JapanMap, MapBase, MapLabel, PaperCard, Stamp, accel, clamp, useProgress, useSpring } from "./parts";
import { MAP, theme } from "./config";

/** シーン内で、各ナレーション文が始まるフレーム。映像はこれに合わせて動く。 */
export type Cues = { chunks: number[]; marks: Record<string, number> };
export const CueContext = createContext<Cues>({ chunks: [], marks: {} });
const useCue = (i: number) => useContext(CueContext).chunks[i] ?? 0;
/** 語句が読まれるフレーム。映像が少し先行して見えるよう、既定で 4 フレーム手前にする。 */
const useMark = (name: string, lead = 4) => {
  const m = useContext(CueContext).marks[name];
  if (m === undefined) throw new Error(`目印がない: ${name}`);
  return m - lead;
};

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "relative", width: MAP.w, height: MAP.h }}>{children}</div>
);
const Overlay: React.FC<{ children: React.ReactNode; top: number; gap?: number }> = ({ children, top, gap = 22 }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", flexDirection: "column", gap, alignItems: "center" }}>{children}</div>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={MAP.w} height={MAP.h} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

export const SceneIntro: React.FC = () => {
  const c0 = useCue(0);
  const c1 = useCue(1);
  const c2 = useCue(2);
  const f = useCurrentFrame();
  const zoom = interpolate(f, [c2, c2 + 50], [0, 1], { ...clamp });
  const basin = Math.max(0, (zoom - 0.5) * 2);
  const cardsOut = 1 - Math.min(1, zoom * 3);
  const fe = useSpring(useMark("east"));
  const fw = useSpring(useMark("west"));
  return (
    <Stage>
      <JapanMap pinAt={c0} zoom={zoom} />
      <div style={{ position: "absolute", inset: 0, opacity: basin }}>
        <MapBase roads={false} />
        <Svg>
          <Flag x={780} y={480} color={theme.east} label="東軍" p={fe} size={1.2} />
          <Flag x={260} y={470} color={theme.west} label="西軍" labelAnchor="end" p={fw} size={1.2} />
        </Svg>
      </div>
      <Overlay top={0}>
        <div style={{ opacity: cardsOut, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          <PaperCard at={c0} title="慶長5年9月15日" size={52} accent={theme.accent} width={560} />
          <PaperCard at={c1} title="新暦 1600年10月21日" size={42} width={640} />
        </div>
      </Overlay>
    </Stage>
  );
};

export const SceneMorning: React.FC = () => {
  const f = useCurrentFrame();
  const c0 = useCue(0);
  const c1 = useCue(1);
  const c2 = useCue(2);
  const mFog = useMark("fog");
  const m8 = useMark("h8");
  const m10 = useMark("h10");
  const hour = interpolate(f, [m10, m10 + 45], [8, 10], { ...clamp, easing: accel });
  const fog = interpolate(f, [mFog, mFog + 30, m10 + 40, m10 + 110], [0, 0.9, 0.9, 0.12], { ...clamp });
  const on8 = f < m10;
  return (
    <Stage>
      <MapBase dim={0.35} showLabels={false} />
      <Fog opacity={fog} />
      <Overlay top={20}>
        <Clock hours={hour} size={440} />
        <PaperCard at={m8} title="説①　午前8時ごろ" sub="笠谷和比古" accent={on8 ? theme.accent : theme.paperEdge} size={42} dim={!on8} />
        <PaperCard at={m10} title="説②　午前10時ごろ" sub="白峰旬" accent={on8 ? theme.paperEdge : theme.accent} size={42} dim={on8} />
      </Overlay>
    </Stage>
  );
};

export const SceneVanguard: React.FC = () => {
  const s = MAP.sekigahara;
  const c0 = useCue(0);
  const c1 = useCue(1);
  const c2 = useCue(2);
  const mF = useMark("fukushima");
  const mI = useMark("ii");
  const mGo = useMark("iiGo");
  const pF = useProgress(mF + 8, 70, accel);
  const pI = useProgress(mGo, 70, accel);
  const f1 = useSpring(mF);
  const f2 = useSpring(mI);
  const src = useSpring(c2);
  const dimI = interpolate(useCurrentFrame(), [c2, c2 + 20], [1, 0.7], { ...clamp });
  return (
    <Stage>
      <MapBase />
      <Svg>
        <Arrow x1={880} y1={s.y + 90} x2={600} y2={s.y + 90} p={pF} color={theme.east} />
        <Arrow x1={880} y1={s.y + 200} x2={500} y2={s.y + 200} p={pI} color={theme.east} dashed fade={dimI} />
        <Flag x={925} y={s.y + 110} color={theme.east} p={f1} size={0.8} />
        <Flag x={925} y={s.y + 220} color={theme.east} p={f2} size={0.8} />
        <MapLabel x={870} y={s.y + 58} text="福島正則隊" size={36} anchor="end" color={theme.east} opacity={f1} />
        <MapLabel x={870} y={s.y + 165} text="井伊直政隊（松平忠吉を伴う）" size={32} anchor="end" color={theme.east} opacity={f2} />
      </Svg>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 8, opacity: src, transform: `translateY(${(1 - src) * 20}px)` }}>
        <PaperCard at={c2} title="点線は逸話" sub="『黒田家譜』『関ヶ原軍記大成』（江戸時代成立）" size={34} />
      </div>
    </Stage>
  );
};

export const SceneBetrayal: React.FC = () => {
  const m = MAP.matsuo;
  const f = useCurrentFrame();
  const c0 = useCue(0);
  const c1 = useCue(1);
  const mK = useMark("kobayakawa");
  const mB = useMark("betray");
  const p = useProgress(mB, 50, accel);
  const lab = useProgress(mB - 4, 20);
  const flip = f >= mB; // 寝返った後は東軍側の色
  const fl = useSpring(mK);
  const burst = useProgress(c1, 25);
  return (
    <Stage>
      <MapBase hotMatsuo showLabels={false} />
      <Svg>
        <MapLabel x={m.x} y={m.y + 150} text="松尾山" />
        <Flag x={m.x - 10} y={m.y - 40} color={flip ? theme.east : theme.west} p={fl} size={1.1} />
        <MapLabel x={m.x + 30} y={m.y - 200} text="小早川秀秋" size={34} anchor="end" color={theme.text} opacity={fl} />
        <Arrow x1={m.x + 60} y1={m.y - 110} x2={m.x + 190} y2={m.y - 300} p={p} color={theme.west} />
        <MapLabel x={m.x + 250} y={m.y - 160} text="寝返り" size={52} anchor="start" color={theme.west} opacity={lab} />
        <circle cx={m.x + 190} cy={m.y - 300} r={30 + burst * 120} fill="none" stroke={theme.accent} strokeWidth={6} opacity={(1 - burst) * (c1 > 0 ? 1 : 0) * (burst > 0 ? 1 : 0)} />
      </Svg>
      <Overlay top={20}>
        <PaperCard at={mK} title="小早川秀秋・脇坂安治・小川祐忠父子ら" size={36} accent={theme.accent} />
        <PaperCard at={mB + 20} title="「うらきり」" sub="9月17日付　石川康通・彦坂元正連署書状" size={38} />
      </Overlay>
    </Stage>
  );
};

export const SceneShots: React.FC = () => {
  const c0 = useCue(0);
  const mGun = useMark("gun");
  const mSplit = useMark("split");
  const q = useSpring(c0);
  return (
    <Stage>
      <MapBase dim={0.22} showLabels={false} />
      <Overlay top={0} gap={26}>
        <div style={{ fontSize: 190, fontWeight: 900, color: theme.accent, opacity: q, lineHeight: 1, transform: `scale(${0.6 + 0.4 * q})` }}>？</div>
        <PaperCard at={mGun + 6} title="『黒田家譜』" sub="家康の指示で、福島正則隊が銃撃" size={40} />
        <PaperCard at={mGun + 30} title="『井伊家慶長記』" sub="家康ではなく、藤堂高虎が自身の判断で銃撃" size={40} />
        <div style={{ marginTop: 36 }}>
          <Stamp at={mSplit} text="研究者の見解も分かれる" />
        </div>
      </Overlay>
    </Stage>
  );
};

export const SceneEnd: React.FC = () => {
  const f = useCurrentFrame();
  const c0 = useCue(0);
  const c1 = useCue(1);
  const c2 = useCue(2);
  const mNoon = useMark("noon");
  const mOct = useMark("oct1");
  const hour = interpolate(f, [mNoon - 40, mNoon + 6], [10, 12], { ...clamp, easing: accel });
  return (
    <Stage>
      <MapBase dim={0.2} showLabels={false} />
      <Overlay top={0}>
        <Clock hours={hour} size={300} />
        <PaperCard at={mNoon} title="9月15日　午の刻（正午ごろ）に戦闘終了" sub="軍記には午後2時ごろとするものもある" size={36} accent={theme.accent} />
        <PaperCard at={mOct} title="10月1日（旧暦）　六条河原で斬首" sub="安国寺恵瓊・小西行長・石田三成" size={36} />
        <PaperCard at={c2} title="当日の記録は、ほとんどが後世の史料です" size={32} />
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
