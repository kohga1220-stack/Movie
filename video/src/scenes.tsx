import React, { useContext } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Clock, JapanMap, PaperCard, Stamp, WorldLabel, accel, clamp, useSpring } from "./parts";
import { LM } from "./terrain";
import { EXAG } from "./terrain";
import { MAP, theme } from "./config";
import { CANVAS_H, projectAt } from "./shots";
import { EAST_POS, WEST_POS } from "./worldlayer";
import { CueContext, useCue, useMark } from "./cues";
export { CueContext };

/** 3D の点を、画面座標に変換して返す（カメラは動くので、毎フレーム計算する）。 */
const useWorld = (p: [number, number, number]) => {
  const { from } = useContext(CueContext);
  const f = useCurrentFrame();
  return projectAt(from + f, p);
};
const gy = (x: number, z: number, elevM: number, up = 0): [number, number, number] => [x, elevM * EXAG + up, z];

const Full: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", inset: 0 }}>{children}</div>;
const Row: React.FC<{ children: React.ReactNode; top: number; gap?: number; justify?: string }> = ({ children, top, gap = 22, justify = "center" }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top, display: "flex", gap, justifyContent: justify, alignItems: "flex-start" }}>{children}</div>
);
const Col: React.FC<{ children: React.ReactNode; top: number; gap?: number }> = ({ children, top, gap = 18 }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top, display: "flex", flexDirection: "column", gap }}>{children}</div>
);
const Anchor: React.FC<{ p: { x: number; y: number } | null; children: (x: number, y: number) => React.ReactNode }> = ({ p, children }) =>
  p && p.x > 40 && p.x < 1040 && p.y > 330 && p.y < 1240 ? <>{children(p.x, p.y)}</> : null;

export const SceneIntro: React.FC = () => {
  const f = useCurrentFrame();
  const c0 = useCue(0);
  const c1 = useCue(1);
  const c2 = useCue(2);
  const zoom = interpolate(f, [c2, c2 + 55], [0, 1], { ...clamp });
  const mapOut = 1 - Math.min(1, Math.max(0, (zoom - 0.55) / 0.45));
  const east = useWorld([EAST_POS[0], 520, EAST_POS[1]]);
  const west = useWorld([WEST_POS[0], 520, WEST_POS[1]]);
  const mE = useMark("east");
  const mW = useMark("west");
  return (
    <Full>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: CANVAS_H, background: "radial-gradient(ellipse at 50% 35%, #1c2230 0%, #12151b 75%)", opacity: mapOut }} />
      <div style={{ position: "absolute", left: 0, top: 330, opacity: mapOut, WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 10%, #000 86%, transparent), linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)", WebkitMaskComposite: "source-in", maskComposite: "intersect" }}>
        <JapanMap pinAt={c0} zoom={zoom} />
      </div>
      <Row top={330} justify="flex-start">
        <div style={{ opacity: mapOut, display: "flex", flexDirection: "column", gap: 14 }}>
          <PaperCard at={c0} title="慶長5年9月15日" size={50} width={540} />
          <PaperCard at={c1} title="新暦 1600年10月21日" size={40} width={640} />
        </div>
      </Row>
      <Anchor p={east}>{(x, y) => <WorldLabel x={x} y={y} text="東軍" sub="（イメージ）" color={theme.east} at={mE} dir="left" />}</Anchor>
      <Anchor p={west}>{(x, y) => <WorldLabel x={x} y={y} text="西軍" sub="（イメージ）" color={theme.west} at={mW} dir="right" />}</Anchor>
    </Full>
  );
};

export const SceneMorning: React.FC = () => {
  const f = useCurrentFrame();
  const m8 = useMark("h8");
  const m10 = useMark("h10");
  const hour = interpolate(f, [m10, m10 + 45], [8, 10], { ...clamp, easing: accel });
  const on8 = f < m10;
  const clk = useSpring(m8 - 30);
  return (
    <Full>
      <div style={{ position: "absolute", right: 56, top: 320, opacity: clk, transform: `scale(${0.85 + 0.15 * clk})`, transformOrigin: "100% 0", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.6))" }}>
        <Clock hours={hour} size={300} />
      </div>
      <Row top={1030} gap={20}>
        <PaperCard at={m8} title="説①　午前8時ごろ" sub="笠谷和比古" size={38} width={470} accent={on8 ? "rgba(217,164,65,0.95)" : "rgba(217,164,65,0.3)"} dim={!on8} />
        <PaperCard at={m10} title="説②　午前10時ごろ" sub="白峰旬" size={38} width={470} accent={on8 ? "rgba(217,164,65,0.3)" : "rgba(217,164,65,0.95)"} dim={on8} />
      </Row>
    </Full>
  );
};

export const SceneVanguard: React.FC = () => {
  const c2 = useCue(2);
  const mF = useMark("fukushima");
  const mI = useMark("ii");
  const pf = useWorld([EAST_POS[0] + 300, 470, -160]);
  const pi = useWorld([EAST_POS[0] + 300, 470, 150]);
  return (
    <Full>
      <Anchor p={pf}>{(x, y) => <WorldLabel x={x - 20} y={y} text="福島正則隊" color={theme.east} at={mF} dir="left" />}</Anchor>
      <Anchor p={pi}>{(x, y) => <WorldLabel x={x - 20} y={y} text="井伊直政隊" sub="松平忠吉を伴う" color="#7fc4ee" at={mI} dir="left" />}</Anchor>
      <Col top={1030}>
        <PaperCard at={c2} title="点線は逸話" sub="『黒田家譜』『関ヶ原軍記大成』（江戸時代成立）" size={36} />
      </Col>
    </Full>
  );
};

export const SceneBetrayal: React.FC = () => {
  const mK = useMark("kobayakawa");
  const mB = useMark("betray");
  const M = LM.matsuoyama;
  const pk = useWorld(gy(M[0], M[1], 289, 330));
  return (
    <Full>
      <Anchor p={pk}>{(x, y) => <WorldLabel x={x + 30} y={y} text="小早川秀秋" sub="松尾山" color={theme.text} at={mK} dir="right" />}</Anchor>
      <Col top={330}>
        <PaperCard at={mK} title="小早川秀秋・脇坂安治・小川祐忠父子ら" size={34} width={960} />
      </Col>
      <Col top={1040}>
        <PaperCard at={mB + 20} title="「うらきり」" sub="9月17日付　石川康通・彦坂元正連署書状" size={38} />
      </Col>
    </Full>
  );
};

export const SceneShots: React.FC = () => {
  const c0 = useCue(0);
  const mGun = useMark("gun");
  const mSplit = useMark("split");
  const q = useSpring(c0);
  return (
    <Full>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: theme.serif, fontSize: 200, fontWeight: 900, color: theme.accent, opacity: q, lineHeight: 1, transform: `scale(${0.6 + 0.4 * q})`, textShadow: "0 8px 30px rgba(0,0,0,0.7)" }}>？</div>
      <Col top={560} gap={18}>
        <PaperCard at={mGun + 6} title="『黒田家譜』" sub="家康の指示で、福島正則隊が銃撃" size={38} />
        <PaperCard at={mGun + 30} title="『井伊家慶長記』" sub="家康ではなく、藤堂高虎が自身の判断で銃撃" size={38} />
      </Col>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center" }}>
        <Stamp at={mSplit} text="研究者の見解も分かれる" />
      </div>
    </Full>
  );
};

export const SceneEnd: React.FC = () => {
  const f = useCurrentFrame();
  const c2 = useCue(2);
  const mNoon = useMark("noon");
  const mOct = useMark("oct1");
  const hour = interpolate(f, [mNoon - 40, mNoon + 6], [10, 12], { ...clamp, easing: accel });
  return (
    <Full>
      <div style={{ position: "absolute", left: 0, right: 0, top: 310, display: "flex", justifyContent: "center", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.6))" }}>
        <Clock hours={hour} size={280} />
      </div>
      <Col top={640} gap={16}>
        <PaperCard at={mNoon} title="9月15日　午の刻（正午ごろ）に戦闘終了" sub="軍記には午後2時ごろとするものもある" size={34} accent="rgba(217,164,65,0.95)" />
        <PaperCard at={mOct} title="10月1日（旧暦）　六条河原で斬首" sub="安国寺恵瓊・小西行長・石田三成" size={34} />
        <PaperCard at={c2} title="当日の記録は、ほとんどが後世の史料です" size={30} />
      </Col>
    </Full>
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
export { MAP };
