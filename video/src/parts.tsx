import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MAP, TAGS, TagKind, theme } from "./config";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1。開始フレームから easeOut で進む。 */
export const useProgress = (start: number, duration: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
};

/** 要件のバネ設定（mass 1 / stiffness 180 / damping 22）。 */
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
        border: `${t.border === "double" ? 6 : 3}px ${t.border} ${theme.accent}`,
        borderRadius: 12,
        opacity: s,
        transform: `scale(${0.8 + 0.2 * s})`,
      }}
    >
      {t.label}
    </div>
  );
};

/** 直線の矢印。p(0→1)で伸びる。dashedは「逸話・不確か」を表す。 */
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p: number;
  color: string;
  dashed?: boolean;
}> = ({ x1, y1, x2, y2, p, color, dashed }) => {
  const cx = x1 + (x2 - x1) * p;
  const cy = y1 + (y2 - y1) * p;
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g opacity={p > 0 ? 1 : 0}>
      <line
        x1={x1}
        y1={y1}
        x2={cx}
        y2={cy}
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={dashed ? "30 20" : undefined}
      />
      <polygon points="0,-24 44,0 0,24" fill={color} transform={`translate(${cx},${cy}) rotate(${angle})`} />
    </g>
  );
};

export const MapLabel: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; anchor?: "start" | "middle" | "end"; opacity?: number }> = ({
  x,
  y,
  text,
  size = 40,
  color = theme.text,
  anchor = "middle",
  opacity = 1,
}) => (
  <text
    x={x}
    y={y}
    fontSize={size}
    fontWeight={700}
    fill={color}
    textAnchor={anchor}
    opacity={opacity}
    style={{ fontFamily: theme.font, paintOrder: "stroke", stroke: theme.bg, strokeWidth: 8 }}
  >
    {text}
  </text>
);

const Mountain: React.FC<{ x: number; y: number; w: number; h: number; hot?: boolean }> = ({ x, y, w, h, hot }) => (
  <polygon
    points={`${x - w / 2},${y + h / 2} ${x - w * 0.12},${y - h / 2} ${x + w * 0.1},${y - h * 0.35} ${x + w * 0.2},${y - h * 0.5} ${x + w / 2},${y + h / 2}`}
    fill={hot ? theme.surfaceHi : theme.surface}
    stroke={hot ? theme.accent : theme.line}
    strokeWidth={hot ? 5 : 3}
  />
);

/** 関ヶ原の模式図。位置は概略で、縮尺や正確な地形ではない。 */
export const MapBase: React.FC<{ dim?: number; hotMatsuo?: boolean; showLabels?: boolean; roads?: boolean }> = ({
  dim = 1,
  hotMatsuo = false,
  showLabels = true,
  roads = true,
}) => {
  const f = useCurrentFrame();
  const pulse = hotMatsuo ? 1 + 0.04 * Math.sin(f / 5) : 1;
  const { sekigahara: s, matsuo: m, nangu: n, akasaka: a } = MAP;
  return (
    <svg width={MAP.w} height={MAP.h} viewBox={`0 0 ${MAP.w} ${MAP.h}`} style={{ opacity: dim }}>
      {/* 盆地 */}
      <ellipse cx={s.x} cy={s.y} rx={420} ry={190} fill={theme.surface} stroke={theme.line} strokeWidth={3} strokeDasharray="14 12" />
      {/* 街道 */}
      <line x1={80} y1={s.y + 18} x2={MAP.w - 40} y2={s.y + 18} stroke={theme.line} strokeWidth={8} />
      <line x1={s.x} y1={s.y + 18} x2={s.x - 40} y2={80} stroke={theme.line} strokeWidth={8} />
      {showLabels && roads && (
        <>
          <MapLabel x={150} y={s.y + 90} text="中山道" size={30} color={theme.textDim} />
          <MapLabel x={s.x - 130} y={150} text="北国街道" size={30} color={theme.textDim} />
        </>
      )}
      {/* 山 */}
      <g transform={`translate(${m.x},${m.y}) scale(${pulse}) translate(${-m.x},${-m.y})`}>
        <Mountain x={m.x} y={m.y} w={300} h={220} hot={hotMatsuo} />
      </g>
      <Mountain x={n.x} y={n.y} w={300} h={200} />
      {showLabels && (
        <>
          <MapLabel x={m.x} y={m.y + 150} text="松尾山" />
          <MapLabel x={n.x} y={n.y + 140} text="南宮山" />
          <MapLabel x={s.x} y={s.y - 40} text="関ヶ原" size={52} color={theme.accent} />
          <MapLabel x={a.x} y={a.y - 50} text="赤坂" size={34} anchor="end" color={theme.textDim} />
          <MapLabel x={a.x} y={a.y - 14} text="（東）" size={26} anchor="end" color={theme.textDim} />
          <MapLabel x={MAP.w - 40} y={50} text="北↑" size={30} anchor="end" color={theme.textDim} />
          <MapLabel x={40} y={MAP.h - 20} text="模式図（位置は概略）" size={28} anchor="start" color={theme.textDim} />
        </>
      )}
    </svg>
  );
};

/** アナログ時計。hours は 12 時間制の時刻（8, 10, 12 …）。 */
export const Clock: React.FC<{ hours: number; size?: number }> = ({ hours, size = 420 }) => {
  const r = size / 2;
  const ticks = Array.from({ length: 12 }, (_, i) => i);
  const angle = (hours % 12) * 30;
  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`}>
      <circle r={r - 6} fill={theme.surface} stroke={theme.accent} strokeWidth={8} />
      {ticks.map((i) => (
        <line
          key={i}
          x1={0}
          y1={-(r - 24)}
          x2={0}
          y2={-(r - (i % 3 === 0 ? 62 : 44))}
          stroke={theme.text}
          strokeWidth={i % 3 === 0 ? 10 : 5}
          transform={`rotate(${i * 30})`}
        />
      ))}
      <line x1={0} y1={0} x2={0} y2={-(r - 100)} stroke={theme.accent} strokeWidth={16} strokeLinecap="round" transform={`rotate(${angle})`} />
      <circle r={14} fill={theme.accent} />
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

export const Card: React.FC<{ children: React.ReactNode; delay?: number; accent?: string; style?: React.CSSProperties }> = ({
  children,
  delay = 0,
  accent = theme.line,
  style,
}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        background: theme.surface,
        border: `4px solid ${accent}`,
        borderRadius: 24,
        padding: "28px 36px",
        color: theme.text,
        fontSize: 44,
        lineHeight: 1.45,
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
