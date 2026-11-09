// Gemini などで生成した 10 本のクリップ（C01〜C10）をつなぎ、音量を整える。
//
// 使い方（video/ で実行）:
//   node tools/assemble_clips.mjs [入力フォルダ] [--out=out/ep02-gemini.mp4]
//   既定の入力フォルダ: clips-in/ep02-full/（C01.mp4 … C10.mp4。docs/gemini-full-production-ep02.md 参照）
//
// 処理：各クリップを 1080x1920・30fps・48kHz ステレオに揃える（音声がなければ無音）→ 0.3 秒のつなぎ目の溶かし（映像・音声）→
//       node tools/master.mjs で -14 LUFS に整える（out/…-master.mp4 と、共有用 -share.mp4）。
// 揃えるだけで、内容（文字・顔・読み）の確認はしない。確認は tools/check_clips.mjs と、人が聴いて行う。
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--")) ?? "clips-in/ep02-full";
const out = args.find((a) => a.startsWith("--out="))?.slice(6) ?? "out/ep02-gemini.mp4";
const XF = 0.3;
const ids = Array.from({ length: 10 }, (_, i) => `C${String(i + 1).padStart(2, "0")}`);
const paths = ids.map((id) => join(dir, `${id}.mp4`));
const missing = ids.filter((_, i) => !existsSync(paths[i]));
if (missing.length) {
  console.log(`足りないクリップ: ${missing.join(", ")}（${dir}）`);
  process.exit(1);
}
mkdirSync("out", { recursive: true });

const probe = (p) => JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", p], { encoding: "utf8" }));
const info = paths.map((p) => {
  const j = probe(p);
  return { dur: Number(j.format.duration), audio: j.streams.some((s) => s.codec_type === "audio") };
});

// 入力と、揃えるフィルタ
const inputs = paths.flatMap((p) => ["-i", p]);
let fc = "";
info.forEach((c, i) => {
  fc += `[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p,setsar=1[v${i}];`;
  fc += c.audio
    ? `[${i}:a]aresample=48000,aformat=channel_layouts=stereo[a${i}];`
    : `anullsrc=r=48000:cl=stereo,atrim=0:${c.dur.toFixed(3)}[a${i}];`;
});
// つなぎ目の溶かし（xfade / acrossfade）。offset は、それまでの合計の長さ − 溶かしの長さ × 回数
let vLast = "v0", aLast = "a0", acc = info[0].dur;
for (let i = 1; i < info.length; i++) {
  const off = (acc - XF).toFixed(3);
  fc += `[${vLast}][v${i}]xfade=transition=fade:duration=${XF}:offset=${off}[vx${i}];`;
  fc += `[${aLast}][a${i}]acrossfade=d=${XF}[ax${i}];`;
  vLast = `vx${i}`;
  aLast = `ax${i}`;
  acc += info[i].dur - XF;
}
fc = fc.replace(/;$/, "");
execFileSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", fc, "-map", `[${vLast}]`, "-map", `[${aLast}]`, "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], { stdio: "inherit" });
console.log(`つないだ動画：${out}（約 ${acc.toFixed(1)} 秒）`);
execFileSync("node", ["tools/master.mjs", out, "--share"], { stdio: "inherit" });
