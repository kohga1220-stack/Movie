// 第1話の文言・色・シーン定義。台本の出典は docs/episode-01-sekigahara.md を参照。
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const theme = {
  bg: "#14181f",
  surface: "#1f2530",
  surfaceHi: "#2a3140",
  line: "#4a5568",
  text: "#f2ede4",
  textDim: "#a9b0bd",
  accent: "#d9a441", // 強調・タグ
  east: "#5aa0c8", // 東軍
  west: "#c8584b", // 西軍
  font: "'Noto Sans JP','IPAexGothic','IPAGothic',sans-serif",
};

export type TagKind = "primary" | "theory" | "legend";

export const TAGS: Record<TagKind, { label: string; border: "solid" | "dashed" | "double" }> = {
  primary: { label: "一次史料", border: "solid" },
  theory: { label: "諸説", border: "dashed" },
  legend: { label: "伝承", border: "double" },
};

export type SceneDef = {
  id: string;
  seconds: number;
  title: string;
  tag?: TagKind;
  captions: string[];
};

export const SCENES: SceneDef[] = [
  {
    id: "intro",
    seconds: 4,
    title: "関ヶ原の戦い",
    captions: [
      "慶長5年9月15日。今の暦で、1600年10月21日。",
      "美濃の関ヶ原で、東軍と西軍が激突します。",
    ],
  },
  {
    id: "morning",
    seconds: 8,
    title: "開戦の時刻",
    tag: "theory",
    captions: [
      "朝の関ヶ原は、霧に包まれていたといいます。",
      "開戦は午前8時ごろとする説があります。ただし、午前10時ごろとする見方もあります。",
    ],
  },
  {
    id: "vanguard",
    seconds: 10,
    title: "先陣争い？",
    tag: "legend",
    captions: [
      "先陣は福島正則と井伊直政。直政が先に進んだ、という逸話が伝わります。",
      "ただし、江戸時代の二次史料による話で、細部は食い違います。",
    ],
  },
  {
    id: "betrayal",
    seconds: 10,
    title: "小早川秀秋、寝返る",
    tag: "primary",
    captions: [
      "戦いの途中で、小早川秀秋らが西軍を裏切ります。",
      "戦いの流れは、ここで大きく変わりました。",
    ],
  },
  {
    id: "shots",
    seconds: 6,
    title: "家康の銃撃？",
    tag: "legend",
    captions: [
      "家康が小早川の陣に鉄砲を撃ち込んだ、という話も有名です。",
      "でも、史料によって内容が違い、確かな裏付けはありません。",
    ],
  },
  {
    id: "end",
    seconds: 7,
    title: "午の刻　決着",
    captions: [
      "戦いは、正午ごろに決着したとされます。",
      "10月1日（旧暦）には、石田三成らが六条河原で斬首されました。",
    ],
  },
];

export const SCENE_FRAMES = SCENES.map((s) => s.seconds * FPS);
export const SCENE_STARTS = SCENE_FRAMES.map((_, i) =>
  SCENE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0),
);
export const DURATION = SCENE_FRAMES.reduce((a, b) => a + b, 0);

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
