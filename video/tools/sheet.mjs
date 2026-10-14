// 書き出した動画から、確認用のコンタクトシート（縮小した静止画を並べた 1 枚）を作る。
// 各ナレーション文の開始 0.5 秒後（動きが落ち着いたころ）と、各場面の終わり（情報が出そろった状態）を、1 枚に 8 コマずつ並べる。
// 動画をもう一度描画しなくてよいので速い。重なり・はみ出し・改行・静止時間を、まず全体で見るための道具。
//
// 使い方:
//   node tools/sheet.mjs [動画ファイル] [--ep=ep02]
//   出力: out/sheets/<動画名>-1.png, -2.png, …
// 考え方の出典：whaleyxbt/claude-motion の review-loop（MIT）の「拍ごとのコンタクトシートを見て直す」。実装は自作。
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";

const args = process.argv.slice(2);
const ep = args.find((a) => a.startsWith("--ep="))?.slice(5);
const file = args.find((a) => !a.startsWith("--")) ?? (ep ? "out/ep02-behaviorism-master.mp4" : "out/ep01-sekigahara-master.mp4");
const timing = JSON.parse(readFileSync(ep ? `src/${ep}/timing.json` : "src/timing.json", "utf8"));
const FONT = "public/fonts/NotoSansJP-Medium.ttf";
const W = 270, H = 480, COLS = 4, ROWS = 2;
const name = file.replace(/^.*\//, "").replace(/\.mp4$/, "");
const tmp = `out/sheets/.tmp-${name}`;
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

// 取り出す時刻（秒）とラベル
const shots = [];
let from = 0;
for (const sc of timing.scenes) {
  sc.chunks.forEach((c, i) => shots.push([`${sc.id}-${i + 1}`, (from + c.startFrame) / timing.fps + 0.5]));
  shots.push([`${sc.id}-end`, (from + sc.frames) / timing.fps - 0.4]); // フェードアウトの直前
  from += sc.frames;
}

shots.forEach(([label, t], i) => {
  const text = `${label}  ${t.toFixed(1)}s`.replace(/:/g, "\\:");
  const vf = `scale=${W}:${H},drawtext=fontfile=${FONT}:text='${text}':x=6:y=6:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=3`;
  execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", t.toFixed(3), "-i", file, "-frames:v", "1", "-vf", vf, `${tmp}/${String(i).padStart(3, "0")}.png`]);
});

const per = COLS * ROWS;
const sheets = Math.ceil(shots.length / per);
for (let s = 0; s < sheets; s++) {
  const start = s * per;
  const count = Math.min(per, shots.length - start);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-start_number", String(start), "-i", `${tmp}/%03d.png`, "-frames:v", "1", "-vf", `tile=${COLS}x${ROWS}:padding=6:color=0x222222`, `out/sheets/${name}-${s + 1}.png`]);
  console.log(`out/sheets/${name}-${s + 1}.png（${count} コマ）`);
}
rmSync(tmp, { recursive: true, force: true });
