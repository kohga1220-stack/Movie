# 歴史ショート動画（Remotion）

縦型（1080x1920 / 30fps）の歴史解説ショート。台本と出典は [`docs/`](../docs)、クレジットは [`docs/credits.md`](../docs/credits.md) を参照。
プロジェクトのルール（文字の改行など）は [`CLAUDE.md`](../CLAUDE.md) を参照。

## 構成

- `src/script.json`：ナレーション文・シーン構成（字幕と音声の元）
- `src/timing.json`：音声の長さから自動で作るタイミング（`tools/gen_narration.py` が出力）
- `src/config.ts`：色・シーン定義
- `src/Text.tsx`：文節改行の文字表示（BudouX ＋ 行の長さをそろえる割り付け）
- `src/parts.tsx`：日本地図・模式図・旗・紙のカード・時計・霧などの部品
- `src/scenes.tsx`：各シーン（ナレーションの文ごとの開始フレームに合わせて動く）
- `src/Ep01.tsx`：第1話の合成（字幕・音声・BGM）
- `tools/gen_narration.py`：ナレーション音声とタイミングの生成
- `tools/gen_bgm.py`：BGM・効果音の合成（外部の音源は使わない）

## 画像・図・音について

- 外部の画像・写真・屏風絵は使っていない。図は SVG で作成。日本地図のみ Natural Earth（パブリックドメイン）。
- 関ヶ原周辺の図は「模式図（位置は概略）」で、縮尺や地形は正確ではない。
- 音声は VOICEVOX（青山龍星、クレジット「VOICEVOX:青山龍星」が必須）。BGM・効果音は自作。

## 使い方

```
npm install
bash tools/setup_voicevox.sh             # 初回のみ。VOICEVOX を公式リリースから取得（先に規約を確認すること）
python -m venv .venv && .venv/bin/pip install .voicevox/voicevox_core-*.whl pyopenjtalk-plus numpy scipy
.venv/bin/python tools/gen_narration.py   # 音声・src/timing.json・docs/narration-readings.md を作る
.venv/bin/python tools/gen_bgm.py         # BGM・効果音を作る
npm run typecheck
npm run studio                            # プレビュー
npx remotion render src/index.ts Ep01Sekigahara out/ep01-sekigahara.mp4 --codec=h264 --audio-codec=aac
```

声の速さ・高さ・抑揚は `tools/gen_narration.py` の `SPEED` / `PITCH` / `INTONATION` で調整できる。
読み間違いは、`src/script.json` の `tts` で直す。読みの一覧は `docs/narration-readings.md`（自動生成）。
`public/audio/` と `out/` は生成物のため、リポジトリには含めない。

## 出力の確認（ffprobe）

h264 / 1080x1920 / 30fps / 2087フレーム（69.6秒）／ AAC 48kHz ステレオ。

## 公開前の確認

`docs/episode-01-sekigahara.md` の「公開前の確認事項」を済ませるまで公開しない。
