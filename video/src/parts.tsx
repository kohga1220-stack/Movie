import React from "react";
import { Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import countries from "world-atlas/countries-10m.json";
import { MAP, SEKIGAHARA_LONLAT, TAGS, TagKind, theme } from "./config";
import { Phrase } from "./Text";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1。開始フレームから easeOut で進む（シーン内のフレーム基準）。 */
export const useProgress = (start: number, duration: number, easing: (t: number) => number = Easing.out(Easing.cubic)) => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + duration], [0, 1], { ...clamp, easing });
};

/** 動きに加速度をつける（等速にしない）。矢印の前進などに使う。 */
export const accel = Easing.inOut(Easing.cubic);

/** バネ（mass 1 / stiffness 180 / damping 22）。 */
export const useSpring = (delay = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { mass: 1, stiffness: 180, damping: 22 } });
};

export const TagBadge: React.FC<{ kind: TagKind; delay?: number }> = ({ kind, delay = 0 }) => {
  const s = useSpring(delay);
  const t = TAGS[kind];
  return (
    <div
      style={{
        display: "inline-block",
        padding: "6px 26px",
        fontSize: 40,
        fontWeight: 700,
        color: theme.accent,
        background: "rgba(18,21,27,0.7)",
        border: `${t.border === "double" ? 6 : 3}px ${t.border} ${theme.accent}`,
        borderRadius: 12,
        opacity: s,
        transform: `scale(${1.3 - 0.3 * s}) rotate(${(1 - s) * -6}deg)`,
      }}
    >
      {t.label}
    </div>
  );
};

/** 紙のカード（史料カード）。文字は Phrase で文節改行する。 */
export const PaperCard: React.FC<{
  at: number;
  title: string;
  sub?: string;
  size?: number;
  accent?: string;
  width?: number | string;
  dim?: boolean;
}> = ({ at, title, sub, size = 44, accent = theme.paperEdge, width = "100%", dim = false }) => {
  const s = useSpring(at);
  const avail = (typeof width === "number" ? width : 960) - 78 - 4; // 余白・枠・安全マージン
  return (
    <div
      style={{
        width,
        background: theme.paper,
        color: theme.ink,
        border: `5px solid ${accent}`,
        borderRadius: 16,
        padding: "20px 34px",
        boxShadow: "0 10px 24px rgba(0,0,0,0.45)",
        opacity: s * (dim ? 0.55 : 1),
        transform: `translateY(${(1 - s) * 50}px)`,
        boxSizing: "border-box",
      }}
    >
      <Phrase text={title} maxEm={avail / size} style={{ fontSize: size, fontWeight: 700, lineHeight: 1.4 }} />
      {sub && <Phrase text={sub} maxEm={avail / Math.round(size * 0.72)} style={{ fontSize: Math.round(size * 0.72), color: theme.inkDim, lineHeight: 1.4, marginTop: 6 }} />}
    </div>
  );
};

/** 朱印風のスタンプ。 */
export const Stamp: React.FC<{ at: number; text: string; rotate?: number }> = ({ at, text, rotate = -8 }) => {
  const s = useSpring(at);
  return (
    <div
      style={{
        display: "inline-block",
        padding: "10px 30px",
        fontSize: 56,
        fontWeight: 900,
        color: theme.leaf,
        border: `8px solid ${theme.leaf}`,
        borderRadius: 14,
        background: "rgba(236,227,207,0.92)",
        opacity: s,
        transform: `scale(${2 - s}) rotate(${rotate}deg)`,
      }}
    >
      {text}
    </div>
  );
};

/** 直線の矢印。p(0→1)で伸びる。dashed は「逸話・不確か」を表す。 */
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color: string; dashed?: boolean; fade?: number }> = ({
  x1, y1, x2, y2, p, color, dashed, fade = 1,
}) => {
  const cx = x1 + (x2 - x1) * p;
  const cy = y1 + (y2 - y1) * p;
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g opacity={p > 0 ? fade : 0}>
      <line x1={x1} y1={y1} x2={cx} y2={cy} stroke={color} strokeWidth={12} strokeLinecap="round" strokeDasharray={dashed ? "30 20" : undefined} />
      <polygon points="0,-24 44,0 0,24" fill={color} transform={`translate(${cx},${cy}) rotate(${angle})`} />
    </g>
  );
};

export const MapLabel: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; anchor?: "start" | "middle" | "end"; opacity?: number }> = ({
  x, y, text, size = 40, color = theme.text, anchor = "middle", opacity = 1,
}) => (
  <text x={x} y={y} fontSize={size} fontWeight={700} fill={color} textAnchor={anchor} opacity={opacity} style={{ fontFamily: theme.font, paintOrder: "stroke", stroke: theme.bg, strokeWidth: 8 }}>
    {text}
  </text>
);

/** 幟（旗）。色を渡し、風にはためく。 */
export const Flag: React.FC<{ x: number; y: number; color: string; label?: string; labelAnchor?: "start" | "end"; p?: number; size?: number }> = ({
  x, y, color, label, labelAnchor = "start", p = 1, size = 1,
}) => {
  const f = useCurrentFrame();
  const H = 130 * size;
  const W = 78 * size;
  const top = y - H;
  const n = 7;
  const edge = (yy: number, dir: 1 | -1) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const k = dir === 1 ? i : n - i;
      return `${x + 5 + (W * k) / n},${yy + Math.sin(f / 5 + k * 0.8) * 4 * (k / n)}`;
    }).join(" ");
  const pts = `${edge(top + 4, 1)} ${edge(top + 4 + 62 * size, -1)}`;
  return (
    <g opacity={p} transform={`translate(0,${(1 - p) * 30})`}>
      <line x1={x} y1={y} x2={x} y2={top - 6} stroke="#e8dcc0" strokeWidth={6} strokeLinecap="round" />
      <polygon points={pts} fill={color} stroke="#12151b" strokeWidth={3} />
      <circle cx={x} cy={y} r={7} fill="#e8dcc0" />
      {label && <MapLabel x={x + (labelAnchor === "start" ? 14 : -14)} y={y + 6} text={label} size={34} anchor={labelAnchor} color={theme.text} />}
    </g>
  );
};

/** 山。等高線風に、小さくしながら重ねる。 */
const Mountain: React.FC<{ x: number; y: number; w: number; h: number; hot?: boolean }> = ({ x, y, w, h, hot }) => {
  const layers = [1, 0.8, 0.6, 0.42, 0.26];
  return (
    <g>
      {layers.map((k, i) => {
        const ww = w * k;
        const hh = h * k;
        const cy = y + h / 2 - hh / 2;
        const pts = `${x - ww / 2},${cy + hh / 2} ${x - ww * 0.12},${cy - hh / 2} ${x + ww * 0.1},${cy - hh * 0.35} ${x + ww * 0.2},${cy - hh * 0.5} ${x + ww / 2},${cy + hh / 2}`;
        return <polygon key={i} points={pts} fill={hot ? `rgba(217,164,65,${0.1 + i * 0.07})` : `rgba(120,140,110,${0.1 + i * 0.07})`} stroke={hot ? theme.accent : "#6f8465"} strokeWidth={hot ? 4 : 2.5} strokeLinejoin="round" />;
      })}
    </g>
  );
};

/** 関ヶ原の模式図。位置は概略で、縮尺や正確な地形ではない。 */
export const MapBase: React.FC<{ dim?: number; hotMatsuo?: boolean; showLabels?: boolean; roads?: boolean }> = ({ dim = 1, hotMatsuo = false, showLabels = true, roads = true }) => {
  const f = useCurrentFrame();
  const pulse = hotMatsuo ? 1 + 0.04 * Math.sin(f / 5) : 1;
  const { sekigahara: s, matsuo: m, nangu: n, akasaka: a } = MAP;
  return (
    <svg width={MAP.w} height={MAP.h} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ opacity: dim }}>
      <ellipse cx={s.x} cy={s.y} rx={420} ry={190} fill="rgba(217,200,150,0.10)" stroke={theme.line} strokeWidth={3} strokeDasharray="14 12" />
      <ellipse cx={s.x} cy={s.y} rx={300} ry={125} fill="rgba(217,200,150,0.07)" />
      <line x1={80} y1={s.y + 18} x2={MAP.w - 40} y2={s.y + 18} stroke="#8a7f66" strokeWidth={9} strokeLinecap="round" />
      <line x1={s.x} y1={s.y + 18} x2={s.x - 40} y2={80} stroke="#8a7f66" strokeWidth={9} strokeLinecap="round" />
      {showLabels && roads && (
        <>
          <MapLabel x={150} y={s.y + 90} text="中山道" size={30} color={theme.textDim} />
          <MapLabel x={s.x - 130} y={150} text="北国街道" size={30} color={theme.textDim} />
        </>
      )}
      <g transform={`translate(${m.x},${m.y}) scale(${pulse}) translate(${-m.x},${-m.y})`}>
        <Mountain x={m.x} y={m.y} w={320} h={230} hot={hotMatsuo} />
      </g>
      <Mountain x={n.x} y={n.y} w={320} h={210} />
      {showLabels && (
        <>
          <MapLabel x={m.x} y={m.y + 150} text="松尾山" />
          <MapLabel x={n.x} y={n.y + 140} text="南宮山" />
          <MapLabel x={s.x} y={s.y - 40} text="関ヶ原" size={52} color={theme.accent} />
          <MapLabel x={a.x} y={a.y - 100} text="赤坂" size={34} anchor="end" color={theme.textDim} />
          <MapLabel x={a.x} y={a.y - 66} text="（東）" size={26} anchor="end" color={theme.textDim} />
          <MapLabel x={MAP.w - 40} y={50} text="北↑" size={30} anchor="end" color={theme.textDim} />
          <MapLabel x={40} y={50} text="模式図（位置は概略）" size={28} anchor="start" color={theme.textDim} />
        </>
      )}
    </svg>
  );
};

// ---- 日本地図（Natural Earth ＝ パブリックドメイン。npm「world-atlas」）----
const topo = countries as unknown as Topology;
const world = feature(topo, topo.objects.countries as never) as unknown as GeoJSON.FeatureCollection;
const japan = world.features.find((x) => String(x.id) === "392") as GeoJSON.Feature;
const projection = geoMercator().fitExtent(
  [
    [30, 40],
    [MAP.w - 30, MAP.h - 40],
  ],
  { type: "MultiPoint", coordinates: [[129.0, 31.0], [143.5, 42.0]] } as GeoJSON.MultiPoint,
);
const japanPath = geoPath(projection)(japan) ?? "";
export const PIN = projection(SEKIGAHARA_LONLAT) as [number, number];

export const JapanMap: React.FC<{ pinAt: number; zoom: number }> = ({ pinAt, zoom }) => {
  const f = useCurrentFrame();
  const pin = useSpring(pinAt);
  const k = 1 + 6 * zoom * zoom;
  const ring = ((f - pinAt) % 45) / 45;
  return (
    <svg width={MAP.w} height={MAP.h} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ opacity: 1 - Math.min(1, zoom * 1.6) }}>
      <g transform={`translate(${PIN[0]},${PIN[1]}) scale(${k}) translate(${-PIN[0]},${-PIN[1]})`}>
        <path d={japanPath} fill="#2b3a33" stroke="#7d9a82" strokeWidth={2.2 / k} strokeLinejoin="round" />
        <circle cx={PIN[0]} cy={PIN[1]} r={(10 + ring * 38) / k} fill="none" stroke={theme.accent} strokeWidth={3 / k} opacity={(1 - ring) * pin} />
        <circle cx={PIN[0]} cy={PIN[1]} r={(13 * pin) / k} fill={theme.accent} stroke={theme.bg} strokeWidth={3 / k} />
      </g>
      <g opacity={pin * (1 - zoom)}>
        <MapLabel x={PIN[0] - 40} y={PIN[1] - 40} text="関ヶ原" size={50} anchor="end" color={theme.accent} />
        <MapLabel x={PIN[0] - 40} y={PIN[1] + 4} text="（現・岐阜県）" size={30} anchor="end" color={theme.textDim} />
      </g>
      <MapLabel x={40} y={MAP.h - 20} text="地図：Natural Earth（パブリックドメイン）" size={26} anchor="start" color={theme.textDim} opacity={1 - zoom} />
    </svg>
  );
};

/** アナログ時計。hours は 12 時間制の時刻（8, 10, 12 …）。 */
export const Clock: React.FC<{ hours: number; size?: number }> = ({ hours, size = 420 }) => {
  const r = size / 2;
  const angle = (hours % 12) * 30;
  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`}>
      <circle r={r - 6} fill={theme.paper} stroke={theme.accent} strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} y1={-(r - 26)} x2={0} y2={-(r - (i % 3 === 0 ? 64 : 46))} stroke={theme.ink} strokeWidth={i % 3 === 0 ? 10 : 5} transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-(r - 100)} stroke={theme.leaf} strokeWidth={16} strokeLinecap="round" transform={`rotate(${angle})`} />
      <circle r={14} fill={theme.leaf} />
    </svg>
  );
};

/** 霧。sin 波で決定的に流す（乱数は使わない）。 */
export const Fog: React.FC<{ opacity: number }> = ({ opacity }) => {
  const f = useCurrentFrame();
  const blobs = [
    { x: 200, y: 200, rx: 380, ry: 90, ph: 0 },
    { x: 800, y: 380, rx: 420, ry: 100, ph: 1.7 },
    { x: 300, y: 560, rx: 400, ry: 110, ph: 3.1 },
    { x: 760, y: 720, rx: 380, ry: 90, ph: 4.6 },
  ];
  return (
    <svg width={MAP.w} height={MAP.h} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ position: "absolute", inset: 0, opacity }}>
      <defs>
        <filter id="fogblur">
          <feGaussianBlur stdDeviation={36} />
        </filter>
      </defs>
      <g filter="url(#fogblur)" fill="#dfe6ee">
        {blobs.map((b, i) => (
          <ellipse key={i} cx={b.x + 60 * Math.sin(f / 60 + b.ph)} cy={b.y} rx={b.rx} ry={b.ry} opacity={0.55} />
        ))}
      </g>
    </svg>
  );
};

/** 舞う紅葉。位置は remotion の random（固定シード）で決める。 */
export const Leaves: React.FC<{ count?: number }> = ({ count = 14 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const x0 = random(`lx${i}`) * 1080;
        const y0 = random(`ly${i}`) * 2000;
        const sp = 0.8 + random(`ls${i}`) * 1.4;
        const ph = random(`lp${i}`) * 6.28;
        const sz = 14 + random(`lz${i}`) * 16;
        const y = ((y0 + f * sp) % 2000) - 40;
        const x = x0 + Math.sin(f / 40 + ph) * 50;
        return (
          <path
            key={i}
            d="M0,-1 C0.6,-0.6 1,-0.1 0.4,0.8 L0,0.5 L-0.4,0.8 C-1,-0.1 -0.6,-0.6 0,-1 Z"
            transform={`translate(${x},${y}) rotate(${f * 1.4 * sp + ph * 40}) scale(${sz})`}
            fill={theme.leaf}
            opacity={0.28}
          />
        );
      })}
    </svg>
  );
};
