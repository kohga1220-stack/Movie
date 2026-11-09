// 生成映像（Gemini など）のクリップ。場面 ID → public/video/ep02/ のファイル名（拡張子なし）と、本体の帯（行）。
// 取り込み方：docs/gemini-video-prompts-ep02.md の §5〜§6。ここに書いたクリップは、必ず public/video/ep02/ にあること。
// bandTop / bandBottom：縦長の出力が「中央の帯（本体）＋ぼかした上下の延長」でできている場合の、本体の行（元の高さ 1280 での行）。
//   `node tools/check_clips.mjs` が「継ぎ目あり：本体の帯 〇〜〇 行」と表示する。継ぎ目がなければ、省略する（全面を使う）。
// 映像は象徴（イメージ）で、事実の主張は、ナレーションとカードが担う。
export type SceneClip = { file: string; bandTop?: number; bandBottom?: number };
export const SCENE_CLIPS: Record<string, SceneClip> = {
  intro: { file: "S1-A", bandTop: 371, bandBottom: 907 }, // 1913年の論文（書物を開く）。10 秒の 1 本で、場面全体（9.7 秒）をまかなう
};
