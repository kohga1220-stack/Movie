// 文言は script.json、音声・字幕のタイミングは timing.json（tools/gen_narration.py が生成）。
import script from "./script.json";
import timing from "./timing.json";

export const FPS = timing.fps;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const theme = {
  bg: "#12151b",
  surface: "#1d2330",
  surfaceHi: "#2a3345",
  line: "#4a5568",
  text: "#f2ede4",
  textDim: "#a9b0bd",
  paper: "#ece3cf",
  paperEdge: "#b9ab8a",
  ink: "#1c1a17",
  inkDim: "#5b5446",
  accent: "#d9a441", // 強調・タグ
  east: "#4f94c4", // 東軍
  west: "#c8584b", // 西軍
  leaf: "#b5452f",
  font: "'Noto Sans JP','IPAexGothic','IPAGothic',sans-serif",
  serif: "'Noto Serif JP','IPAexMincho',serif",
};

export type TagKind = "primary" | "theory" | "legend";

export const TAGS: Record<TagKind, { label: string; border: "solid" | "dashed" | "double" }> = {
  primary: { label: "一次史料", border: "solid" },
  theory: { label: "諸説", border: "dashed" },
  legend: { label: "伝承", border: "double" },
};

export type Chunk = { text: string; file: string; startFrame: number; frames: number; marks?: Record<string, number | undefined> };
export type SceneDef = {
  id: string;
  title: string;
  tag: TagKind | null;
  frames: number;
  from: number;
  chunks: Chunk[];
  /** 語句が読まれるシーン内のフレーム（目印の名前 → フレーム）。script.json の marks から自動で作る。 */
  marks: Record<string, number>;
};

let cursor = 0;
export const SCENES: SceneDef[] = script.scenes.map((s, i) => {
  const t = timing.scenes[i];
  const def: SceneDef = {
    id: s.id,
    title: s.title,
    tag: s.tag as TagKind | null,
    frames: t.frames,
    from: cursor,
    chunks: s.chunks.map((c, j) => ({ text: c.text, ...t.chunks[j] })),
    marks: {},
  };
  for (const c of def.chunks) {
    for (const [name, f] of Object.entries(c.marks ?? {})) if (f !== undefined) def.marks[name] = c.startFrame + f;
  }
  cursor += t.frames;
  return def;
});
export const DURATION = cursor;

export const FOOTER = "出典：Wikipedia「関ヶ原の戦い」ほか（一覧は概要欄）｜諸説あり";

// 模式図の座標（位置は概略。縮尺・正確な地形ではない）
export const MAP = {
  w: 1080,
  h: 860,
  sekigahara: { x: 540, y: 400 },
  matsuo: { x: 290, y: 650 }, // 松尾山（関ヶ原の南西）
  nangu: { x: 800, y: 660 }, // 南宮山
  akasaka: { x: 985, y: 430 }, // 赤坂（東）
};

// 関ケ原町の位置（Wikipedia「関ケ原町」の座標：北緯35.365556・東経136.466944）
export const SEKIGAHARA_LONLAT: [number, number] = [136.466944, 35.365556];
