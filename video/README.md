# 歴史ショート動画（Remotion）

縦型（1080x1920 / 30fps）の歴史解説ショート。台本と出典は [`docs/`](../docs) を参照。

## 構成

- `src/config.ts`：文言・色・シーン定義（台本どおり）
- `src/parts.tsx`：地図の模式図・時計・霧・カードなどの部品
- `src/scenes.tsx`：各シーン
- `src/Ep01.tsx`：第1話「関ヶ原の戦い（開戦から）」の合成

## 画像・図について

外部の画像・写真・屏風絵は使っていない。図はすべてこのリポジトリ内で作った SVG で、
地図は「模式図（位置は概略）」である。縮尺や地形は正確ではない。

## 使い方

```
npm install
npm run studio        # プレビュー
npm run typecheck     # 型チェック
npx remotion render src/index.ts Ep01Sekigahara out/ep01-sekigahara.mp4
```

## 出力の確認

`ffprobe` で確認した結果：h264 / 1080x1920 / 30fps / 1350フレーム / 45.0秒。
音声は付けていない（ナレーションは字幕のみ。TTS の商用利用条件は未確認のため）。

## 公開前の確認

`docs/episode-01-sekigahara.md` の「公開前の確認事項」を済ませるまで公開しない。
