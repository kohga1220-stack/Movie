# 参考にした公開リポジトリの評価（2026-10-14）

ユーザーが共有した 15 件のうち、リポジトリのトップページ（README・ファイル一覧）と、一部の `SKILL.md`・参照表を読んで評価した。**スクリプトは実行していない。** 星の数や「Opus 5.5 で最良」などの宣伝文は、確認していない。
外部のスキルは、AIへの指示文とスクリプトの集まり。取り込む前に中身を読み、ライセンスを記録する。このリポジトリでは、**第三者のスキルの本文は取り込まず**、考え方を自分の言葉で要約して `docs/motion-guidelines.md` に反映した。

| リポジトリ | ライセンス | 判断 | 取り入れたこと |
|---|---|---|---|
| remotion-dev/skills（公式） | 未確認（README に記載なし） | 手元で導入する場合は `npx skills add remotion-dev/skills`。このリポジトリには取り込まない | — |
| whaleyxbt/claude-motion | MIT | 考え方を借りた | 拍ごとのコンタクトシートで自分の描画を見直す（→ `tools/sheet.mjs`）。時間・動きの数値の目安。最初のフレームの注意 |
| LottieFiles/motion-design-skill | MIT（紹介サイトの記載。LICENSE は未確認） | 数値表を要約して参考にした | 退場は登場の 65〜75%、段の長さ、バネ、オーバーシュートの予算 |
| Barty-Bart/motion-graphics | MIT（音源は CC0・Mixkit など） | 発想のみ | 使う音源のライセンスを毎回確認し、クレジット欄を書き出す運用（`docs/credits.md` と同じ考え）。この動画は音を自作なので、スキルは使わない |
| charlie947/motion-graphics-skills | MIT | 発想のみ | 「画面の名前・日付・数字は、承認した事実の表から」（すでに同じ規則）。`brand-intake` は CLAUDE.md に規則を書き足すため、入れない |
| howseen-ai/claude-motion-design | MIT | QA の発想のみ | 最初のフレームの確認、フラッシュ（1 フレームの崩れ）検出、ループの継ぎ目検査。HTML + Playwright 方式で、Remotion ではない |
| haidrrrry/claude-remotion-skill | MIT | 見送り | すでに同等のこと（描画→確認→修正）をしている |
| AbubakrChan/product-launch-motion | MIT | 見送り | 製品ローンチ動画向け。README に有料サービスへの誘導がある |
| nateherkai/hyperframes-student-kit | LICENSE あり（種類は未確認） | 見送り | 撮影した映像の編集向け。有料の外部サービスが前提の部分がある |
| heygen-com/hyperframes | Apache 2.0 | 見送り | Remotion からの乗り換えは割に合わない |
| greensock/gsap-skills（公式） | MIT | 見送り | Web サイト向け。Remotion のフレーム駆動とは合わない |
| motiondivision/motion、remotion-dev/remotion | — | 今回は未確認 | Remotion はすでに使用中（`docs/credits.md`） |

## 未確認のこと
- 各リポジトリの `SKILL.md` の全文、スクリプトの安全性（実行していない）。
- remotion-dev/skills のライセンス。
