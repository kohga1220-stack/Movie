# クレジットとライセンス

動画の概要欄には、「動画の概要欄に載せる表記」をそのまま転記する。

## 動画の概要欄に載せる表記

```
【音声】Open JTalk / HTS Voice "Mei"（MMDAgent Project Team, 名古屋工業大学, CC BY 3.0）http://www.mmdagent.jp/
【地図】Natural Earth（パブリックドメイン）
【BGM・効果音】自作（スクリプトで合成）
【出典】Wikipedia「関ヶ原の戦い」ほか（一覧は台本ドキュメント docs/episode-01-sekigahara.md）
```

## 使用した素材・ソフトウェア

| 種類 | 名称 | ライセンス | 備考 |
|---|---|---|---|
| 音声合成 | Open JTalk（pyopenjtalk-plus 0.4.1） | pyopenjtalk-plus: MIT／Open JTalk: 修正BSD | 辞書は NAIST Japanese Dictionary（BSD 系、同梱の `COPYING`） |
| 音声（声） | HTS Voice "Mei"（`mei_normal`） | CC BY 3.0 | クレジット表記が必須（上記）。同梱の `LICENSE_mei_normal.htsvoice` で確認 |
| 地図データ | Natural Earth（npm「world-atlas」2.0.2 経由） | データ：パブリックドメイン／パッケージ：ISC | 日本の輪郭のみ使用 |
| 描画 | d3-geo 3.1.1 / topojson-client 3.1.0 | ISC | |
| 文節分割 | BudouX 0.9.3（Google） | Apache-2.0 | 文字の改行位置の決定に使用 |
| 動画生成 | Remotion 4.0.533 | Remotion License | 個人は商用を含めて無料（同梱の `LICENSE.md` で確認）。法人の場合は規模により有償 |
| 関ヶ原の座標 | Wikipedia「関ケ原町」 | CC BY-SA 4.0（座標という事実のみを使用） | 北緯35.365556・東経136.466944 |
| BGM・効果音 | 自作（`video/tools/gen_bgm.py`） | — | 外部の音源は使っていない |
| 文字フォント | 書き出し環境のシステムフォント（IPAゴシック） | IPA Font License v1.0 | 公開用の書き出し環境では、使うフォントとそのライセンスを確認すること |

## 未確認のこと

- 公開先（YouTube・TikTok・Instagram）ごとの、AI 生成コンテンツの表示ルール。
- 音声合成（Mei）の、各プラットフォームでの利用に関する追加の規約（CC BY 3.0 のクレジットのみで足りると読めるが、プラットフォーム側のルールは別）。
