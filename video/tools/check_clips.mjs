// Gemini などで生成した映像クリップを、取り込み前に確認し、整える。
//
// 使い方（video/ で実行）:
//   node tools/check_clips.mjs [入力フォルダ] [--normalize] [--full]   （--full：C01〜C10 の方式）
//   既定の入力フォルダ: clips-in/ep02/（S1-A.mp4 のように、ショット ID で名前を付ける。docs/gemini-video-prompts-ep02.md 参照）
//
// 確認：期待するショットの有無・縦横比 9:16・長さ・音声の有無・fps。確認用の画像（各クリップの 4 コマ）を out/clips/ に出す。
//   → 画像は、人（または Claude）が、文字・顔・動物の描写・字幕の領域を目視で確認するためのもの。自動では判定できない。
// --normalize：720x1280・30fps・音声なしに揃えて public/video/ep02/ に書き出す（元ファイルは変えない）。Remotion が 1080x1920 に拡大して使う。
//   元が 720x1280 なので、ファイルは拡大せず、小さく保つ（Git に入れて、新しい環境でも描画できるようにするため）。
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { basename, extname, join } from "node:path";

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--")) ?? "clips-in/ep02";
const FULL = args.includes("--full"); // 全部 Gemini の方式（C01〜C10。docs/gemini-full-production-ep02.md）
const EXPECTED = FULL ? Array.from({ length: 10 }, (_, i) => `C${String(i + 1).padStart(2, "0")}`) : ["S1-A", "S1-B", "S2-A", "S2-B", "S2-C", "S3-A", "S3-B", "S3-C", "S4-A", "S4-B", "S4-C", "S5-A", "S5-B", "S5-C", "S6-A"];
const FONT = "public/fonts/NotoSansJP-Medium.ttf";
const labelFilter = (label) => (existsSync(FONT) ? `,drawtext=fontfile=${FONT}:text='${label}':x=6:y=6:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=3` : ""); // フォントがない環境（npm install 前）でも動くように
// 縦長の出力が、中央の帯（本体）と、ぼかした上下の延長でできている場合の、継ぎ目の行を探す（行ごとの隣との差の最大）。
// 見つからなければ null（継ぎ目なし＝フルフレームの可能性）。値は、元の高さでの行番号。
const findBand = (path, w, h, dur) => {
  const ys = [0.35, 0.6, 0.85].map((f) => {
    const buf = spawnSync("ffmpeg", ["-v", "error", "-ss", (dur * f).toFixed(2), "-i", path, "-frames:v", "1", "-vf", "format=gray", "-f", "rawvideo", "-"], { maxBuffer: 1 << 26 }).stdout;
    if (buf.length < w * h) return null;
    const d = new Float64Array(h - 1);
    for (let y = 0; y < h - 1; y++) {
      let sum = 0;
      for (let x = 0; x < w; x += 2) sum += Math.abs(buf[(y + 1) * w + x] - buf[y * w + x]);
      d[y] = sum / (w / 2);
    }
    const peak = (a, b) => { let m = a; for (let y = a; y < b; y++) if (d[y] > d[m]) m = y; return [m, d[m]]; };
    const [t, tv] = peak(Math.floor(h * 0.15), Math.floor(h * 0.45));
    const [b, bv] = peak(Math.floor(h * 0.55), Math.floor(h * 0.85));
    return { t, tv, b, bv };
  }).filter(Boolean);
  const med = (k) => ys.map((r) => r[k]).sort((a, b) => a - b)[Math.floor(ys.length / 2)];
  if (!ys.length) return null;
  const strong = med("tv") > 25 && med("bv") > 25; // 継ぎ目は、隣との差がはっきり大きい
  return strong ? { top: med("t") + 1, bottom: med("b") + 1 } : null;
};
const MAX_SEC = FULL ? 10.5 : 8.5; // 上限（映像のみの方式は 8 秒、全部 Gemini の方式は 10 秒）に少し余裕を持たせる
const rows = [];
const note = (id, ok, text) => rows.push({ id, ok, text });

if (!existsSync(dir)) {
  console.log(`入力フォルダがありません: ${dir}\n生成した動画を、ショット ID の名前（例 S1-A.mp4）で、このフォルダに置いてください。`);
  process.exit(1);
}
const files = readdirSync(dir).filter((f) => /\.(mp4|mov|webm)$/i.test(f));
const byId = new Map(files.map((f) => [basename(f, extname(f)).toUpperCase(), f]));
for (const f of files) if (!EXPECTED.includes(basename(f, extname(f)).toUpperCase())) note(f, false, "ショット ID に一致しないファイル名（無視する）");

mkdirSync("out/clips", { recursive: true });
const tiles = [];
for (const id of EXPECTED) {
  const f = byId.get(id);
  if (!f) {
    note(id, false, "ファイルなし");
    continue;
  }
  const path = join(dir, f);
  const p = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", path], { encoding: "utf8" }));
  const v = p.streams.find((s) => s.codec_type === "video");
  const hasAudio = p.streams.some((s) => s.codec_type === "audio");
  const dur = Number(p.format.duration);
  const [n, d] = (v.r_frame_rate || "0/1").split("/").map(Number);
  const fps = d ? n / d : 0;
  const ratio = v.width / v.height;
  const issues = [];
  if (Math.abs(ratio - 9 / 16) > 0.01) issues.push(`縦横比が 9:16 でない（${v.width}x${v.height}）`);
  if (dur > MAX_SEC) issues.push(`長い（${dur.toFixed(1)}秒）`);
  if (dur < 2) issues.push(`短い（${dur.toFixed(1)}秒）`);
  const audioNote = hasAudio ? (FULL ? "（音声あり）" : "（音声あり。取り込み時に外す）") : FULL ? "（音声なし：ナレーションが入っていない）" : "";
  if (FULL && !hasAudio) issues.push("音声がない（ナレーションが必要）");
  const band = v.height > v.width ? findBand(path, v.width, v.height, dur) : null;
  const bandNote = band ? `  ［継ぎ目あり：本体の帯 ${band.top}〜${band.bottom} 行（clips.ts に bandTop / bandBottom として記録）］` : v.height > v.width ? "  ［継ぎ目なし］" : "";
  note(id, issues.length === 0, `${v.width}x${v.height} ${fps.toFixed(0)}fps ${dur.toFixed(1)}s${audioNote}${bandNote}${issues.length ? "  ← " + issues.join("／") : ""}`);
  // 確認用の 4 コマ
  for (const [k, frac] of [0, 0.33, 0.66, 0.97].entries()) {
    const out = `out/clips/.t-${id}-${k}.png`;
    const label = `${id}  ${(dur * frac).toFixed(1)}s`;
    execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", (dur * frac).toFixed(2), "-i", path, "-frames:v", "1", "-vf", `scale=270:480${labelFilter(label)}`, out]);
    tiles.push(out);
  }
  if (args.includes("--normalize")) {
    mkdirSync("public/video/ep02", { recursive: true });
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", path, "-an", "-vf", "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=30", "-c:v", "libx264", "-crf", "22", "-preset", "slow", "-pix_fmt", "yuv420p", `public/video/ep02/${id}.mp4`]);
  }
}

// 4 コマ × 2 クリップ = 1 枚（8 コマ）
for (let s = 0; s * 8 < tiles.length; s++) {
  const chunk = tiles.slice(s * 8, s * 8 + 8);
  const list = `out/clips/.list-${s}.txt`;
  execFileSync("python3", ["-I", "-c", `import sys;open(sys.argv[1],'w').write(''.join("file '"+p.split('/')[-1]+"'\\nduration 1\\n" for p in sys.argv[2:]))`, list, ...chunk]);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", list, "-frames:v", "1", "-vf", "tile=4x2:padding=6:color=0x222222", `out/clips/sheet-${s + 1}.png`]);
  rmSync(list, { force: true });
}
for (const t of tiles) rmSync(t, { force: true });

for (const r of rows) console.log(`${r.ok ? "OK  " : "要確認"} ${r.id}  ${r.text}`);
console.log(`\n確認用の画像：out/clips/sheet-*.png（${Math.ceil(tiles.length / 8)} 枚）${args.includes("--normalize") ? "\n整えた映像：public/video/ep02/" : ""}`);
console.log("画像で目視：文字・数字が映っていない／実在の人物に見える顔がない／動物が傷ついて見えない／上 15%・下 25% が静か");
process.exit(rows.every((r) => r.ok) ? 0 : 1);
