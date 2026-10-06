# クレジットとライセンス

動画の概要欄には、「動画の概要欄に載せる表記」をそのまま転記する。

## 動画の概要欄に載せる表記

```
【音声】VOICEVOX:青山龍星
【地図】Natural Earth（パブリックドメイン）
【BGM・効果音】自作（スクリプトで合成）
【出典】Wikipedia「関ヶ原の戦い」ほか（一覧は台本ドキュメント docs/episode-01-sekigahara.md）
```

## 使用した素材・ソフトウェア

| 種類 | 名称 | ライセンス | 備考 |
|---|---|---|---|
| 音声合成 | VOICEVOX CORE 0.16.4（`voicevox_core`） | MIT | https://github.com/VOICEVOX/voicevox_core |
| 音声合成 | ONNX Runtime（VOICEVOX ビルド 1.17.3） | 同梱の `TERMS.txt`・`third-party-notices.html` を参照 | |
| 音声（声） | 青山龍星（ノーマル）の音声モデル（VVM 0.16.4） | VOICEVOX 音声モデル利用規約＋青山龍星の規約 | 「VOICEVOX:青山龍星」のクレジットが必須。**個人は商用・非商用とも可。企業が携わる形で利用する場合は、事前確認が必要**（https://v.seventhh.com/contact/）。詳細：https://www.virvoxproject.com/voicevoxの利用規約 |
| 辞書 | NAIST Japanese Dictionary（pyopenjtalk-plus 同梱） | BSD 系（同梱の `COPYING`） | 読み上げの前処理に使用 |
| 地図データ | Natural Earth（npm「world-atlas」2.0.2 経由） | データ：パブリックドメイン／パッケージ：ISC | 日本の輪郭のみ使用 |
| 描画 | d3-geo 3.1.1 / topojson-client 3.1.0 | ISC | |
| 文節分割 | BudouX 0.9.3（Google） | Apache-2.0 | 文字の改行位置の決定に使用 |
| 動画生成 | Remotion 4.0.533 | Remotion License | 個人は商用を含めて無料（同梱の `LICENSE.md` で確認）。法人の場合は規模により有償 |
| 関ヶ原の座標 | Wikipedia「関ケ原町」 | CC BY-SA 4.0（座標という事実のみを使用） | 北緯35.365556・東経136.466944 |
| BGM・効果音 | 自作（`video/tools/gen_bgm.py`） | — | 外部の音源は使っていない |
| 文字フォント | 書き出し環境のシステムフォント（IPAゴシック） | IPA Font License v1.0 | 公開用の書き出し環境では、使うフォントとそのライセンスを確認すること |

## 未確認のこと

- 公開先（YouTube・TikTok・Instagram）ごとの、AI 生成コンテンツの表示ルール。
- 青山龍星の規約の詳細ページ（virvoxproject.com）は、今回は読めていない。READMEの要約のみを確認した。公開前に、本文を確認すること。
- 収益化などで企業が関わる場合は、「ななはぴ」への事前確認が必要。
- VOICEVOX の規約への同意は、利用者自身の判断で行うこと（取得スクリプトは同意を代行しない）。
