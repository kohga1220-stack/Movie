# Remotion 動画制作プロンプト集（Claude Code 用）

Claude Code で破綻なく高品質な Remotion 動画を作成・出力させるための実践用プロンプト。
冗長な英語指示を整理し、3段階に分割している。各ファイルのコードブロックをそのまま貼り付けて使う。

| ステップ | ファイル | 内容 | 次に進む条件 |
|---|---|---|---|
| 1 | [prompts/01-storyboard.md](prompts/01-storyboard.md) | コードを書かせず `brief.md` / `style-guide.md` / `storyboard.md` を作成 | `storyboard.md` を自分でレビューして承認 |
| 2 | [prompts/02-implementation.md](prompts/02-implementation.md) | `SaaSDemo`（1920x1080 / 30fps / 450f）の実装と `preview.mp4` 出力 | 型チェック・lint が通り、出力仕様を確認 |
| 3 | [prompts/03-vertical.md](prompts/03-vertical.md) | `SaaSDemoVertical`（1080x1920）の再レイアウトと最終出力 | 横・縦の両 MP4 を確認 |

## 使い方の要点

- ステップ1は「承認まで停止させる」のが肝。ストーリーボードの承認前にコードを書かせない。
- ステップ2・3は、直前のステップの成果物（`storyboard.md`、`SaaSDemo`）が同じセッションに存在する前提で書かれている。
- 動画の仕様（15秒・30fps・450フレーム）とヘッドライン文言は例示。用途に応じて、ステップ1の `Timeline requirements` を書き換える。
