// 第2話：行動主義と新行動主義。年表・書誌カード・概念図で見せる（3D・地図は使わない）。
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../config";
import { useCue } from "../cues";
import { clamp, PaperCard, Stamp, useProgress, useSpring } from "../parts";
import { Phrase } from "../Text";

const YEARS = [1913, 1948, 1957, 1959];

/** 画面上部の年表。active 番目の年を強調する。 */
const Timeline: React.FC<{ active: number }> = ({ active }) => {
  const p = useProgress(0, 14);
  return (
    <div style={{ position: "absolute", top: 300, left: 120, right: 120, height: 120, opacity: p }}>
      <div style={{ position: "absolute", top: 34, left: 0, right: 0, height: 4, background: theme.line, borderRadius: 2 }} />
      {YEARS.map((y, i) => {
        const x = `${(i / (YEARS.length - 1)) * 100}%`;
        const on = i === active;
        return (
          <div key={y} style={{ position: "absolute", left: x, top: 0, transform: "translateX(-50%)", textAlign: "center" }}>
            <div style={{ width: on ? 28 : 18, height: on ? 28 : 18, margin: `${on ? 22 : 27}px auto 0`, borderRadius: "50%", background: on ? theme.accent : theme.line, boxShadow: on ? `0 0 18px ${theme.accent}` : "none" }} />
            <div style={{ marginTop: 12, fontFamily: theme.serif, fontWeight: 900, fontSize: on ? 44 : 34, color: on ? theme.accent : theme.textDim }}>{y}</div>
          </div>
        );
      })}
    </div>
  );
};

/** 書誌カード（著者・年・題名・掲載誌）。uncertain なら破線。 */
const Cite: React.FC<{ at: number; author: string; year: number; title: string; venue: string; note?: string; dashed?: boolean }> = ({ at, author, year, title, venue, note, dashed }) => {
  const s = useSpring(at);
  return (
    <div style={{ width: 920, padding: "26px 36px", boxSizing: "border-box", borderRadius: 18, background: "rgba(29,35,48,0.88)", border: `3px ${dashed ? "dashed" : "solid"} ${dashed ? theme.line : theme.accent}`, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: theme.font, fontSize: 32, color: theme.accent, fontWeight: 700 }}>{author}（{year}）</div>
      <div style={{ fontFamily: theme.serif, fontSize: 40, fontWeight: 700, margin: "10px 0 8px", lineHeight: 1.35 }}>{title}</div>
      <div style={{ fontFamily: theme.font, fontSize: 28, color: theme.textDim }}>{venue}</div>
      {note && <div style={{ fontFamily: theme.font, fontSize: 28, color: theme.textDim, marginTop: 8 }}>{note}</div>}
    </div>
  );
};

// 年表の下から字幕の上までの領域に、縦に並べて中央寄せする
const Col: React.FC<{ children: React.ReactNode; gap?: number; top?: number }> = ({ children, gap = 28, top = 450 }) => (
  <div style={{ position: "absolute", top, height: 1290 - top - 20, left: 80, right: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap }}>{children}</div>
);

/** 英語の引用カード（折り返しあり）。 */
const Quote: React.FC<{ at: number; text: string; sub: string }> = ({ at, text, sub }) => {
  const s = useSpring(at);
  return (
    <div style={{ width: 920, padding: "28px 36px", boxSizing: "border-box", borderRadius: 18, background: "rgba(236,227,207,0.94)", color: theme.ink, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ fontFamily: theme.serif, fontSize: 44, fontWeight: 700, lineHeight: 1.4, fontStyle: "italic" }}>“{text}”</div>
      <div style={{ fontFamily: theme.font, fontSize: 28, color: theme.inkDim, marginTop: 14, lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
};

const Chip: React.FC<{ at: number; text: string; dim?: boolean; dashed?: boolean }> = ({ at, text, dim, dashed }) => {
  const s = useSpring(at);
  return (
    <div style={{ padding: "14px 34px", borderRadius: 14, fontFamily: theme.serif, fontSize: 46, fontWeight: 900, background: "rgba(29,35,48,0.9)", border: `3px ${dashed ? "dashed" : "solid"} ${dim ? theme.line : theme.accent}`, color: dim ? theme.textDim : theme.text, opacity: s, transform: `scale(${0.85 + 0.15 * s})` }}>{text}</div>
  );
};

export const Intro: React.FC = () => {
  const c1 = useCue(1);
  const n = Math.round(interpolate(useProgress(4, 40), [0, 1], [1850, 1913], clamp));
  return (
    <AbsoluteFill>
      <Timeline active={0} />
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", fontFamily: theme.serif, fontWeight: 900, fontSize: 200, color: theme.accent, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>{n}</div>
      <Col top={760}>
        <Cite at={c1} author="ジョン・B・ワトソン" year={1913} title="Psychology as the Behaviorist Views It" venue="Psychological Review, 20, 158–177" note="（題名の日本語訳は未確認のため、原題のまま）" />
      </Col>
    </AbsoluteFill>
  );
};

export const Declaration: React.FC = () => {
  const c0 = useCue(0), c1 = useCue(1), c2 = useCue(2);
  return (
    <AbsoluteFill>
      <Timeline active={0} />
      <Col>
        <Quote at={c0} text="a purely objective experimental branch of natural science" sub="ワトソン（1913）冒頭の一文より。日本語は仮訳：純粋に客観的な、実験的な自然科学の一分野" />
        <Chip at={c1} text="目標：行動の予測と制御" />
        <Chip at={c2} text="内観への依存 ＝ 批判" dim dashed />
      </Col>
    </AbsoluteFill>
  );
};

export const Neo: React.FC = () => {
  const c0 = useCue(0), c1 = useCue(1), c2 = useCue(2);
  return (
    <AbsoluteFill>
      <Timeline active={1} />
      <Col gap={30}>
        <Chip at={c0} text="新行動主義（1930〜40年代）" />
        <div style={{ display: "flex", gap: 24 }}>
          <Chip at={c1} text="ハル" />
          <Chip at={c1 + 6} text="トールマン" />
        </div>
        <Chip at={c2} text="スキナー？（資料により分類が違う）" dim dashed />
        <div style={{ marginTop: 20 }}>
          <Stamp at={c2 + 10} text="諸説" />
        </div>
      </Col>
    </AbsoluteFill>
  );
};

/** 迷路の概念図（実際の実験装置ではない）。 */
const Maze: React.FC = () => {
  const p = useProgress(10, 60);
  const path = "M 90 330 L 90 90 L 330 90 L 330 250 L 530 250 L 530 90 L 690 90";
  return (
    <svg width={780} height={420} viewBox="0 0 780 420" style={{ opacity: useProgress(0, 12) }}>
      <g stroke={theme.line} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 90 330 L 90 90 L 330 90 L 330 250 L 530 250 L 530 90 L 690 90" />
        <path d="M 90 330 L 330 330 L 330 250" strokeDasharray="2 18" />
        <path d="M 530 250 L 690 250 L 690 330" strokeDasharray="2 18" />
      </g>
      <path d={path} stroke={theme.accent} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <text x={690} y={60} textAnchor="middle" fill={theme.accent} fontFamily={theme.font} fontSize={30}>ゴール</text>
      <text x={90} y={380} textAnchor="middle" fill={theme.textDim} fontFamily={theme.font} fontSize={30}>スタート</text>
    </svg>
  );
};

export const MazeScene: React.FC = () => {
  const c0 = useCue(0), c1 = useCue(1), c2 = useCue(2);
  return (
    <AbsoluteFill>
      <Timeline active={1} />
      <Col gap={14}>
        <Cite at={c0} author="E・C・トールマン" year={1948} title="Cognitive maps in rats and men" venue="Psychological Review, 55(4), 189–208" />
        <div style={{ transform: "scale(0.7)", margin: "-60px 0" }}>
          <Maze />
        </div>
        <div style={{ fontFamily: theme.font, fontSize: 26, color: theme.textDim }}>※ 概念図（イメージ）。実際の実験装置ではありません</div>
        <Chip at={c1} text="刺激と反応だけでは説明できない" />
        <Chip at={c2} text="再現性に疑問（2026年のレビュー）" dim dashed />
      </Col>
    </AbsoluteFill>
  );
};

export const SkinnerScene: React.FC = () => {
  const c0 = useCue(0), c1 = useCue(1), c2 = useCue(2);
  return (
    <AbsoluteFill>
      <Timeline active={2} />
      <Col gap={22}>
        <Cite at={c0} author="B・F・スキナー" year={1957} title="Verbal Behavior（言語行動）" venue="書籍" />
        <div style={{ fontFamily: theme.serif, fontSize: 60, color: theme.accent, opacity: useSpring(c1) }}>▼</div>
        <Cite at={c1} author="ノーム・チョムスキー" year={1959} title="A Review of B. F. Skinner’s Verbal Behavior" venue="Language, 35(1), 26–58" />
        <Chip at={c2} text="書評の評価は、立場によって分かれる" dim dashed />
      </Col>
    </AbsoluteFill>
  );
};

export const End: React.FC = () => {
  const c0 = useCue(0), c1 = useCue(1);
  return (
    <AbsoluteFill>
      <Timeline active={-1} />
      <Col gap={34}>
        <PaperCard at={c0} title="認知革命（1950年代以降）" sub="言語学・神経科学・計算機科学の発展が、心への関心を高めたとされる" size={50} />
        <Chip at={c1} text="出典は概要欄に掲載" dim />
      </Col>
    </AbsoluteFill>
  );
};

export const SCENE_COMPONENTS: Record<string, React.FC> = {
  intro: Intro,
  declaration: Declaration,
  neo: Neo,
  maze: MazeScene,
  skinner: SkinnerScene,
  end: End,
};
