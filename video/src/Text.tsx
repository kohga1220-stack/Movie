import React from "react";
import { loadDefaultJapaneseParser } from "budoux";

/**
 * 読みやすい改行のための文字表示（プロジェクトルール：CLAUDE.md）。
 *
 * - 句点（。）の後は必ず改行する。
 * - 文節の切れ目は BudouX（Google・Apache-2.0）で求め、文節の途中では折り返さない。
 * - 行の長さがそろうように、動的計画法で改行位置を決める（ブラウザ依存にしない）。
 *   読点（、）の後は切りやすく、「という」「による」のような短い平仮名の語の直前は切りにくくする。
 */
const parser = loadDefaultJapaneseParser();

/** 文字幅（em）。全角は 1、半角の英数字は 0.55。 */
const em = (s: string) => Array.from(s).reduce((a, ch) => a + (/[ -~]/.test(ch) ? 0.55 : 1), 0);

const isShortKana = (s: string) => /^[぀-ゟ]{1,3}$/.test(s.replace(/[、。]/g, ""));

export const breakLines = (sentence: string, maxEm: number): string[] => {
  const ph = parser.parse(sentence);
  const n = ph.length;
  const w = ph.map(em);
  const total = w.reduce((a, b) => a + b, 0);
  if (total <= maxEm) return [ph.join("")];
  const lineWidth = (i: number, j: number) => w.slice(i, j).reduce((a, b) => a + b, 0);
  const best: number[] = Array(n + 1).fill(Infinity);
  const prev: number[] = Array(n + 1).fill(0);
  best[0] = 0;
  for (let j = 1; j <= n; j++) {
    for (let i = 0; i < j; i++) {
      const lw = lineWidth(i, j);
      if (lw > maxEm && j - i > 1) continue;
      let cost = (maxEm - lw) ** 2 * (j === n ? 0.4 : 1);
      if (lw > maxEm) cost += 5000; // 1文節が長すぎる場合
      if (j < n) {
        const last = ph[j - 1];
        if (/[、。]$/.test(last)) cost -= 25; // 読点の後は切りやすい
        if (isShortKana(ph[j])) cost += 400; // 「いう」「よる」などの前では切らない
        if (Array.from(last).length <= 2 && !/[、。]$/.test(last)) cost += 60;
      }
      if (best[i] + cost < best[j]) {
        best[j] = best[i] + cost;
        prev[j] = i;
      }
    }
  }
  const lines: string[] = [];
  for (let j = n; j > 0; j = prev[j]) lines.unshift(ph.slice(prev[j], j).join(""));
  return lines;
};

export const Phrase: React.FC<{ text: string; maxEm?: number; style?: React.CSSProperties }> = ({ text, maxEm = 15.5, style }) => {
  const lines = text
    .split(/\n/)
    .flatMap((l) => l.split(/(?<=。)/))
    .filter((l) => l.length > 0)
    .flatMap((s) => breakLines(s, maxEm));
  return (
    <span style={{ display: "block", ...style }}>
      {lines.map((l, i) => (
        <span key={i} style={{ display: "block", whiteSpace: "nowrap" }}>
          {l}
        </span>
      ))}
    </span>
  );
};
