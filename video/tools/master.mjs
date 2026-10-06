// 書き出した動画の音量を整える（ラウドネス正規化：-14 LUFS、トゥルーピーク -1.5 dB）。映像は再エンコードしない。
// SNS（YouTube・TikTok・Instagram）で、スマホのスピーカーでも聞こえる音量にするための工程。
//
// 使い方:
//   node tools/master.mjs [入力mp4] [--share]
//   既定の入力: out/ep01-sekigahara.mp4 → 出力: out/ep01-sekigahara-master.mp4
//   --share を付けると、共有用に圧縮した版（映像 crf 26）も出す: out/ep01-sekigahara-share.mp4
import { execFileSync, spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("--")) ?? "out/ep01-sekigahara.mp4";
const master = input.replace(/\.mp4$/, "-master.mp4");
const share = input.replace(/\.mp4$/, "-share.mp4");
const TARGET = { I: -14, TP: -1.5, LRA: 11 };

// 1 回目：測定
const p1 = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-nostats", "-i", input, "-vn", "-af", `loudnorm=I=${TARGET.I}:TP=${TARGET.TP}:LRA=${TARGET.LRA}:print_format=json`, "-f", "null", "-"],
  { encoding: "utf8" },
);
const m = JSON.parse(p1.stderr.slice(p1.stderr.lastIndexOf("{"), p1.stderr.lastIndexOf("}") + 1));
console.log(`測定：統合 ${m.input_i} LUFS／トゥルーピーク ${m.input_tp} dB／LRA ${m.input_lra}`);

// 2 回目：測定値を使って、線形に補正（音質を保つ）
const filter = `loudnorm=I=${TARGET.I}:TP=${TARGET.TP}:LRA=${TARGET.LRA}:measured_I=${m.input_i}:measured_LRA=${m.input_lra}:measured_TP=${m.input_tp}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
execFileSync("ffmpeg", ["-y", "-v", "error", "-i", input, "-c:v", "copy", "-af", filter, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", master]);
console.log(`出力：${master}`);

if (args.includes("--share")) {
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", master, "-c:v", "libx264", "-crf", "26", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", share]);
  console.log(`出力（共有用）：${share}`);
}
