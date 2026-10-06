// 書き出した動画の品質チェック（自動で確認できる部分）と、目視確認用の静止画の書き出し。
//
// 使い方:
//   node tools/qa.mjs [動画ファイル] [--stills]
//   環境変数 BROWSER_EXECUTABLE で、Remotion に使うブラウザ（chrome-headless-shell）を指定できる。
//
// 自動チェック: 解像度・fps・フレーム数・音声ストリーム・長さ・読みの一覧の有無。
// 目視チェック（--stills）: 各ナレーション文の開始直後と、各場面の終わりの静止画を out/qa/ に出す。
//   → docs/qa-checklist.md の項目（重なり・はみ出し・改行位置・静止時間）を、静止画で確認する。
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--")) ?? "out/ep01-sekigahara.mp4";
const timing = JSON.parse(readFileSync("src/timing.json", "utf8"));
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok, detail });

const probe = JSON.parse(
  execFileSync("ffprobe", ["-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", file], { encoding: "utf8" }),
);
const v = probe.streams.find((s) => s.codec_type === "video");
const a = probe.streams.find((s) => s.codec_type === "audio");
check("解像度 1080x1920", v?.width === 1080 && v?.height === 1920, `${v?.width}x${v?.height}`);
check("30fps", v?.r_frame_rate === "30/1", v?.r_frame_rate);
check(`フレーム数 = timing.json の ${timing.totalFrames}`, Number(v?.nb_read_frames) === timing.totalFrames, String(v?.nb_read_frames));
check("音声ストリームがある", Boolean(a), a ? `${a.codec_name} ${a.sample_rate}Hz` : "なし");
const secs = Number(probe.format.duration);
check("長さが映像と音声で 0.1 秒以内に一致", a ? Math.abs(Number(a.duration) - Number(v.duration)) < 0.1 : false, `${v?.duration} / ${a?.duration}`);
check("ショートとして 90 秒以内", secs <= 90, `${secs.toFixed(1)} 秒`);
check("読みの一覧がある（docs/narration-readings.md）", existsSync("../docs/narration-readings.md"));

if (args.includes("--stills")) {
  mkdirSync("out/qa", { recursive: true });
  const frames = [];
  let from = 0;
  for (const sc of timing.scenes) {
    sc.chunks.forEach((c, i) => frames.push([`${sc.id}-${i + 1}`, from + c.startFrame + 24]));
    frames.push([`${sc.id}-end`, from + sc.frames - 12]); // フェードアウト（8フレーム）の直前
    from += sc.frames;
  }
  const browser = process.env.BROWSER_EXECUTABLE ? [`--browser-executable=${process.env.BROWSER_EXECUTABLE}`] : [];
  browser.push("--gl=angle"); // 3D（WebGL）の描画
  for (const [name, f] of frames) {
    execFileSync("npx", ["remotion", "still", "src/index.ts", "Ep01Sekigahara", `out/qa/${name}.png`, `--frame=${f}`, ...browser], { stdio: "ignore" });
  }
  check(`静止画 ${frames.length} 枚を out/qa/ に出力（目視で確認）`, true);
}

for (const r of results) console.log(`${r.ok ? "OK  " : "NG  "} ${r.name}${r.detail ? `  [${r.detail}]` : ""}`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
