# クレジットとライセンス

動画の概要欄には、「動画の概要欄に載せる表記」をそのまま転記する。

## 動画の概要欄に載せる表記

```
【音声】VOICEVOX:青山龍星
【地図】Natural Earth（パブリックドメイン）
【地形】Terrain Tiles（AWS Open Data）。SRTM・GMTED2010 の地形データは米国地質調査所（USGS）提供、ETOPO1 は米国海洋大気庁（NOAA）。高さを強調し、平滑化して使用
【フォント】Noto Serif JP / Noto Sans JP（SIL OFL 1.1）
【BGM・効果音】自作（スクリプトで合成）
【出典】Wikipedia「関ヶ原の戦い」ほか（一覧は台本ドキュメント docs/episode-01-sekigahara.md）
```

### 第2話（行動主義と新行動主義）の概要欄

```
【音声】VOICEVOX:青山龍星
【フォント】Noto Serif JP / Noto Sans JP（SIL OFL 1.1）
【BGM・効果音】自作（スクリプトで合成）
【出典】
・Watson, J. B. (1913). Psychology as the behaviorist views it. Psychological Review, 20, 158–177.（Classics in the History of Psychology: https://psychclassics.yorku.ca/Watson/views.htm）
・Tolman, E. C. (1948). Cognitive maps in rats and men. Psychological Review, 55(4), 189–208.（https://psychclassics.yorku.ca/Tolman/Maps/maps.htm）
・Chomsky, N. (1959). A review of B. F. Skinner's Verbal Behavior. Language, 35(1), 26–58.
・Palmer, D. C. (2006). On Chomsky's appraisal of Skinner's Verbal Behavior: A half century of misunderstanding. The Behavior Analyst, 29(2), 253–267.（https://pmc.ncbi.nlm.nih.gov/articles/PMC2223153/）
・Tolman's Sunburst Maze 80 Years on: A Meta-Analysis Reveals Poor Replicability and Little Evidence for Shortcutting. European Journal of Neuroscience, 63(1), 2026. doi:10.1111/ejn.70365
・Greenwood, J. D. (2015). Neobehaviorism, radical behaviorism, and problems of behaviorism. In A Conceptual History of Psychology (pp. 410–453). Cambridge University Press. doi:10.1017/CBO9781107414914.012
・Graham, R. & Griffin, S. (2025). Cognitive Psychology, 1.2 History of Cognitive Psychology.（CC BY-NC-SA 4.0: https://nmoer.pressbooks.pub/cognitivepsychology/）
```

第2話は、画像・地図・外部の音源を使っていない（年表・書誌カード・概念図は、すべて自作の描画）。論文の英語の一文（Watson 1913 冒頭）は、短い引用として画面に出している。

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
| 地形（標高）データ | AWS Open Data「Terrain Tiles」（terrarium 形式・z=12。tilezen/joerd の attribution.md の指示に従い表記） | 元データは SRTM・GMTED2010（USGS、パブリックドメイン。クレジット要請あり）、ETOPO1（NOAA、パブリックドメイン）ほか | 1.7 倍に強調し、1m 刻みの階段を平滑化（ガウシアン）している。位置の検証：南宮山 419m（Wikipedia 419m）、松尾山 周辺の最大 約289m（同 292.9m） |
| 3D 描画 | three.js 0.170 / @react-three/fiber / @remotion/three | MIT | |
| フォント | Noto Serif JP・Noto Sans JP（npm「@expo-google-fonts」経由） | SIL OFL 1.1 | 動画に埋め込んで使用可。同梱の `LICENSE_FONT` を参照 |
| 山の座標 | Wikipedia「松尾山 (岐阜県)」「南宮山」 | CC BY-SA 4.0（座標という事実のみを使用） | 松尾山：北緯35.346667・東経136.453611／南宮山：北緯35.346828・東経136.509795 |
| 関ヶ原の座標 | Wikipedia「関ケ原町」 | CC BY-SA 4.0（座標という事実のみを使用） | 北緯35.365556・東経136.466944 |
| BGM・効果音 | 自作（`video/tools/gen_bgm.py`） | — | 外部の音源は使っていない |
| 文字フォント | 書き出し環境のシステムフォント（IPAゴシック） | IPA Font License v1.0 | 公開用の書き出し環境では、使うフォントとそのライセンスを確認すること |

## 未確認のこと

- 公開先（YouTube・TikTok・Instagram）ごとの、AI 生成コンテンツの表示ルール。
- 青山龍星の規約の詳細ページ（virvoxproject.com）は、今回は読めていない。READMEの要約のみを確認した。公開前に、本文を確認すること。
- 収益化などで企業が関わる場合は、「ななはぴ」への事前確認が必要。
- VOICEVOX の規約への同意は、利用者自身の判断で行うこと（取得スクリプトは同意を代行しない）。

## 参考にした資料（コード・素材は取り込んでいない）

- video-shotcraft（Apache-2.0）の品質基準：静止時間・動きの加速度・ペース・音の考え方。https://github.com/Vincentwei1021/video-shotcraft
  同梱の効果音には、出所が不明なものがあるため、コピーしていない。
- video-talkcraft（PolyForm Noncommercial）：商用利用に作者の許可が必要なため、コードは取り込んでいない。「音声に動きを合わせる」考え方のみを参考にした（実装は VOICEVOX のモーラ長から自作）。
