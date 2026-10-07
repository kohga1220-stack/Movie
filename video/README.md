# 歴史ショート動画（Remotion）

縦型（1080x1920 / 30fps）の歴史解説ショート。台本と出典は [`docs/`](../docs)、クレジットは [`docs/credits.md`](../docs/credits.md) を参照。
プロジェクトのルール（文字の改行など）は [`CLAUDE.md`](../CLAUDE.md) を参照。

## 構成

- `src/script.json`：ナレーション文・シーン構成（字幕と音声の元）
- `src/timing.json`：音声の長さから自動で作るタイミング（`tools/gen_narration.py` が出力）
- `src/config.ts`：色・シーン定義
- `src/Text.tsx`：文節改行の文字表示（BudouX ＋ 行の長さをそろえる割り付け）
- `src/parts.tsx`：日本地図・ガラス調のカード・時計・ラベルなどの2D部品
- `src/terrain.ts` / `src/World.tsx` / `src/world3d.tsx` / `src/worldlayer.tsx` / `src/shots.ts`：実際の標高データによる3D地形、軍勢（イメージ）・旗・進軍の矢印、霧と光、カメラの動き
- `src/scenes.tsx`：各シーンの2D重ね表示（カード・ラベル）。ナレーションの文ごと、さらに語句ごと（`script.json` の `marks`）の読み上げ時刻に合わせて動く
- `src/episode.tsx`：全話共通の合成（字幕・音声・BGM・仕上げ）。`src/Ep01.tsx` が第1話、`src/ep02/` が第2話（台本・タイミング・場面）
- `tools/gen_narration.py`：ナレーション音声とタイミングの生成
- `tools/gen_bgm.py`：BGM・効果音の合成（外部の音源は使わない）
- `tools/gen_terrain.py`：標高データ（AWS Terrain Tiles）から3D用の地形データを作る
- `tools/copy_fonts.mjs`：フォント（Noto Serif JP / Sans JP）を public/fonts にコピー（`npm install` で自動実行）

## 画像・図・音について

- 外部の画像・写真・屏風絵は使っていない。日本地図は Natural Earth（パブリックドメイン）、関ヶ原周辺は実際の標高データ（AWS Terrain Tiles）で、3D の地形を描いている。
- 地形の高さは 1.7 倍に強調している（動画内にも表記）。軍勢（人影・旗）はイメージで、実際の布陣・兵数ではない。
- 音声は VOICEVOX（青山龍星、クレジット「VOICEVOX:青山龍星」が必須）。BGM・効果音は自作。

## 使い方

```
npm install
bash tools/setup_voicevox.sh             # 初回のみ。VOICEVOX を公式リリースから取得（先に規約を確認すること）
python -m venv .venv && .venv/bin/pip install .voicevox/voicevox_core-*.whl pyopenjtalk-plus numpy scipy
.venv/bin/python tools/gen_narration.py   # 音声・src/timing.json・docs/narration-readings.md を作る
.venv/bin/python tools/gen_bgm.py         # BGM・効果音を作る
.venv/bin/pip install pillow && .venv/bin/python tools/gen_terrain.py   # 地形データを作る（標高データを取得）
npm run typecheck
npm run studio                            # プレビュー
npx remotion render src/index.ts Ep01Sekigahara out/ep01-sekigahara.mp4 --codec=h264 --audio-codec=aac   # 3D のため、約15分かかる（remotion.config.ts で ANGLE を指定済み）
```

語句の同期：`src/script.json` の各文に `"marks": {"名前": "読みの一部（カナ）"}` を書くと、その語句が読まれる時刻が `timing.json` に出る。
シーン側では `useMark("名前")` で、そのフレームを取り出せる。見つからないとエラーになる。

声の速さ・高さ・抑揚は `tools/gen_narration.py` の `SPEED` / `PITCH` / `INTONATION` で調整できる。
読み間違いは、`src/script.json` の `tts` で直す。読みの一覧は `docs/narration-readings.md`（自動生成）。
`public/audio/` と `out/` は生成物のため、リポジトリには含めない。

## 音量（書き出しのあとに必ず行う）

Remotion の書き出しそのままの音量は小さい（約 -20 LUFS）。SNS 向けの標準（約 -14 LUFS）に整えてから、投稿・共有する。

```
node tools/master.mjs out/ep01-sekigahara.mp4 --share
# → out/ep01-sekigahara-master.mp4（映像はそのまま・音量を整えたもの）
# → out/ep01-sekigahara-share.mp4（共有用に圧縮。上限のあるチャット等で送るとき）
```

## 品質チェック

```
node tools/qa.mjs --stills   # 自動チェック（音量含む）と、目視用の静止画（out/qa/）。既定の対象は master 版
```
チェックリストは [`docs/qa-checklist.md`](../docs/qa-checklist.md)。

## 出力の確認（ffprobe）

h264 / 1080x1920 / 30fps / 2213フレーム（73.8秒）／ AAC 48kHz ステレオ。

## 公開前の確認

`docs/episode-01-sekigahara.md` の「公開前の確認事項」を済ませるまで公開しない。

## 第2話（行動主義と新行動主義）

```bash
python tools/gen_narration.py ep02   # src/ep02/script.json → 音声・src/ep02/timing.json・docs/narration-readings-ep02.md
python tools/gen_bgm.py ep02         # public/audio/ep02/bgm.wav
npm run render:ep02                  # out/ep02-behaviorism.mp4
node tools/master.mjs out/ep02-behaviorism.mp4 --share
node tools/qa.mjs out/ep02-behaviorism-master.mp4 --ep=ep02
```

台本は未検証の下書き（docs/episode-02-behaviorism.md）。事実確認のゲートを通るまで公開しない。タグの表示は「原典」「諸説」「要確認」。
