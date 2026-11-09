# 第2話「行動主義と新行動主義」— Gemini 動画生成プロンプト集

**状態：下書き。** Gemini には、この環境から接続できない。このファイルのプロンプトを、あなたが Gemini に貼り付けて使う。
元になる台本・出典は `docs/episode-02-behaviorism.md`（事実確認の第1回まで。人間のゲートは未通過）。**このプロンプト集は、台本の主張を増やさない。**

## 0. 先に決めておくこと（この動画シリーズのルール）

| ルール | 理由 |
|---|---|
| 生成映像は「**イメージ映像（象徴）**」として使う。事実の主張は、ナレーションと画面のカード（原典・年・書誌）が担う | 「資料を捏造しない」（CLAUDE.md）。生成映像は、史実の記録に見えてはいけない |
| **実在の人物（ワトソン、トールマン、スキナー、チョムスキー）の顔・似顔を生成させない** | 本人に似た映像は、事実と誤解される。顔のない手・影・物で表す |
| 映像の中に、**文字・年号・数字を出させない** | 動画生成は、文字が崩れやすい。年号や題名は、Remotion のカードで出す（正確さを保つ） |
| 音声は不要（映像だけ使う） | ナレーションは VOICEVOX、BGM・効果音は自作。生成された音は、使わない |
| 使った場合は、`docs/credits.md` と動画の概要欄に「映像の一部に生成AIを使用」と記載し、各プラットフォームの AI 表示ルールを確認する | 公開先のルールは、未確認 |

## 1. Gemini に最初に貼る指示（共通の前置き）

```
You will generate a series of short vertical video clips for an educational Japanese
history-of-psychology short. I will send one shot prompt at a time. For EVERY shot:

- Aspect ratio 9:16 (vertical). Highest resolution available. No audio needed.
- Keep one consistent look across all shots (see STYLE below).
- NEVER render any readable text, letters, numbers, years, logos, watermarks or captions.
  If something like a book cover or sign must appear, keep it blank or out of focus.
- NEVER depict a real, identifiable person. No faces. Use hands, silhouettes seen from
  behind, objects, places and abstract light instead.
- These are symbolic illustrations, not historical footage. Do not imitate archival film.
- Keep the center band of the frame (roughly the middle 55% of the height) as the focal area.
  Keep the top ~15% and bottom ~25% calm and low-detail, because captions will be added there.
- Slow, smooth, deliberate camera motion. No fast cuts, no whip pans, no flashing.
- Each clip is ONE continuous shot, no scene cuts inside the clip.

STYLE (apply to every shot):
Cinematic, restrained, documentary-illustration look. Deep navy-black background (#12151b),
warm gold accent light (#d9a441), aged-paper cream highlights (#ece3cf). Soft volumetric
light, shallow depth of field, very subtle film grain. Muted, low-saturation colors.
Slightly stylized (not photoreal faces, no uncanny realism). Calm, thoughtful mood.

NEGATIVE (avoid in every shot):
text, letters, numbers, subtitles, watermark, logo, real person's face, celebrity likeness,
photorealistic human faces, archival film look, cartoon mascots, gore, harm to animals,
flashing lights, glitch, heavy lens flare, neon cyberpunk, fast motion, shaky camera.

DELIVERY RULES (apply to every shot):
1. Name the file exactly "<ShotID>.mp4" (for example S1-A.mp4) and make it downloadable.
   If you can only give a preview, say so and tell me where the download button is.
2. After each clip, print this LOG block (plain text, no extra commentary):
   SHOT: <ShotID>
   PROMPT_USED: <the exact prompt text you used, verbatim>
   DURATION_SEC: <number, or "unknown">
   ASPECT: <e.g. 9:16>
   SELF_CHECK (answer yes / no / unsure for each):
     readable_text_or_numbers_visible: ...
     real_person_face_visible: ...
     animal_looks_harmed: ...
     contains_flashing_or_cuts: ...
     top_15pct_and_bottom_25pct_calm: ...
   NOTES: <anything unexpected, one line>
   Do not say "pass" if any answer is "unsure". If any check fails, regenerate once with the
   fix and show the new LOG.
3. When I say "manifest", print a table of all shots: ShotID | file name | status
   (ok / redo / not yet) | one-line note. List the shots to redo at the end.

Reply "ready" and wait for shot 1.
```

> 長さの上限は、お使いのモデル・プランで確認する（短いクリップ単位のことが多い）。各ショットは **8 秒以内** に収めてある。長さを指定できない場合は、短い方を採用して、Remotion 側で静止・ゆっくりした拡大で間を持たせる。

## 2. ショット一覧（15 本）

各ショットは、`docs/episode-02-behaviorism.md` の主張の番号と、ナレーション（`video/src/ep02/script.json`）に対応する。
秒数は、音声から決まる場面の長さ（`timing.json`）に合わせた目安。足りない分は、Remotion で静止させる。

| ID | 場面 | 目安 | ナレーション（字幕と同じ） | 主張 # |
|---|---|---|---|---|
| S1-A | 1913年の論文 | 5 s | 1913年、ある論文が、心理学の向かう先を変えようとしました。 | 1 |
| S1-B（任意） | 〃 | 3 s | 書いたのは、ジョン・ワトソンです。 | 1 |
| S2-A | 行動主義の宣言 | 6 s | 論文は、心理学を、純粋に客観的な、実験的な自然科学の一分野だと述べました。 | 2 |
| S2-B | 〃 | 3 s | 目標は、行動の予測と制御。 | 3 |
| S2-C | 〃 | 3 s | 内観に頼る心理学を、批判したのです。 | 4 |
| S3-A | 新行動主義 | 6 s | その後、1930〜40年代に「新行動主義」が登場します。 | 5 |
| S3-B | 〃 | 3 s | 代表は、ハルとトールマンです。 | 5 |
| S3-C | 〃 | 4 s | ただし、スキナーを含めるかは、資料によって違います。 | 6 |
| S4-A | 認知地図 | 6 s | トールマンは1948年の論文で、ラットが迷路の「認知地図」を学ぶと論じました。 | 7 |
| S4-B | 〃 | 4 s | 刺激と反応だけでは説明できない、という立場です。 | 8 |
| S4-C | 〃 | 6 s | ただし、この迷路実験の再現性には、2026年のレビューが疑問を示しています。 | 9 |
| S5-A | 言語行動 | 7 s | スキナーは1957年の『言語行動』で、言語も行動主義で説明しようとしました。 | 10 |
| S5-B | 〃 | 4 s | 1959年、チョムスキーが批判的な書評を書きます。 | 11 |
| S5-C | 〃 | 3 s | この書評の評価は、立場によって分かれます。 | 12 |
| S6-A | 認知革命 | 6 s | 1950年代以降、心の働きに目を向ける「認知革命」が起こったとされます。 | 13 |

（S1-A は 10 秒で生成され、場面1の全体（9.7 秒）をまかなえるため、S1-B は不要になった。必要なら、別の映像として使う。）
（S6 の2文目「出典は、概要欄に載せています。」は、S6-A の映像の上に字幕だけを出す。）

## 3. ショット別プロンプト

各ブロックを、§1 の前置きのあとに、1 本ずつ貼る。英語で書いてあるのは、動画生成では英語の方が意図が伝わりやすいため。日本語のメモは、貼らなくてよい。
構成は「撮影方法 → 主題 → 動き → 場所・光 → 雰囲気」。

### S1-A（5 秒）— 1913年の論文
メモ：学術誌を想起させる象徴。**誌名・題名は映さない**（ページの文字はぼかす）。
```
Shot S1-A, 5 seconds. Slow push-in, locked low angle on a dark wooden desk. A stack of
bound academic journals with blank, unmarked spines. A single hand (no face, no sleeve
logos) lifts the top journal and lets its pages fan open; the pages are blurred and
illegible. Warm gold lamplight from the left, deep navy shadows, drifting dust motes in
the beam. Early twentieth-century study atmosphere, quiet and expectant. Vertical 9:16.
```

### S1-B（3 秒）— 書いた人（顔なし）
メモ：ワトソン本人の描写は避ける。「書く」という行為だけ。
```
Shot S1-B, 3 seconds. Close-up, slight top-down angle, very slow drift to the right.
A hand holding a fountain pen finishes the last stroke on a sheet of paper; the ink lines
are abstract squiggles, no legible writing. Cream paper, gold lamplight, shallow depth of
field, background dissolving into navy darkness. No face visible. Vertical 9:16.
```

### S2-A（6 秒）— 客観的な、実験的な自然科学
メモ：「実験室」の象徴。測る・記録する雰囲気。
```
Shot S2-A, 6 seconds. Slow lateral dolly along a long laboratory bench in a dim, orderly
room. Glass flasks, brass instruments, a mechanical recording drum with a paper strip
slowly moving, all without any readable markings. Cool blue-white light from a high window
mixed with warm gold highlights on brass. Precise, clean, objective mood. No people.
Vertical 9:16, focal area in the middle band.
```

### S2-B（3 秒）— 行動の予測と制御
メモ：「予測と制御」は、メーターの針が目標に合う象徴で表す。数字は出さない。
```
Shot S2-B, 3 seconds. Macro close-up, almost static camera with a very slow push-in on a
brass gauge with a thin needle that sweeps and settles precisely on a mark; the dial has
no numbers or letters, only plain tick marks. Gold rim light, navy background, shallow
depth of field. Calm, controlled, precise mood. Vertical 9:16.
```

### S2-C（3 秒）— 内観への批判
メモ：「内面だけを見る方法」から「外から観察する方法」への転換の象徴。批判的・攻撃的にならない。
```
Shot S2-C, 3 seconds. Slow pull-back from a small dim room where a single desk lamp is
fading out, revealing a bright open window and a view toward an orderly laboratory beyond.
No people. Light shifts from warm dim gold to cool daylight. Quiet, contemplative, a
gentle change of direction. Vertical 9:16.
```

### S3-A（6 秒）— 新しい流れ
メモ：「流れが生まれる」。2つの流れが分かれて別の方向へ。
```
Shot S3-A, 6 seconds. Aerial slow glide over a dark landscape seen from above, abstract:
a single river of gold light that splits into two thinner streams and curves in a new
direction, glowing softly against a deep navy ground. Subtle mist, gentle motion, no
buildings, no text. Sense of a new current forming. Vertical 9:16.
```

### S3-B（3 秒）— ハルとトールマン（人物なし）
メモ：2人の代表を、**人物ではなく2種類の道具**で表す（機械的な装置と、地図）。
```
Shot S3-B, 3 seconds. Slow side-to-side camera move across a dark table on which two
objects sit side by side: on the left, a brass mechanical apparatus with gears; on the
right, an old hand-drawn map-like paper with plain abstract lines and no writing. Warm
gold light grazing both objects, navy background. Balanced, two-part composition.
No people. Vertical 9:16.
```

### S3-C（4 秒）— スキナー：分類が資料によって違う
メモ：「分類が分かれる」の象徴。道しるべの分岐。**スキナー本人は出さない**。
```
Shot S3-C, 4 seconds. Slow push-in toward a fork in a misty path at dusk: one path drawn
in solid gold light, the other in faint dashed light, a blank wooden signpost at the fork
with no writing. Navy twilight, soft fog, quiet uncertain mood. No people.
Vertical 9:16.
```

### S4-A（6 秒）— ラットと迷路と「認知地図」
メモ：実験装置の再現ではなく、**概念図**。ラットは動物を傷つけない、穏やかな描写。画面に「イメージ」と明記する。
```
Shot S4-A, 6 seconds. Slow top-down crane shot over a stylized miniature maze with clean
low walls on a dark surface. A small stylized white rat walks calmly through the corridors.
As it moves, a faint glowing gold map of the whole maze gradually draws itself in the air
above the maze, like a memory taking shape. No text, no numbers. Soft lighting, shallow
depth of field. Gentle, curious mood; the animal is safe and unharmed. Vertical 9:16.
```

### S4-B（4 秒）— 刺激と反応だけでは説明できない
メモ：原典（Tolman 1948）が、S-R 説を「電話交換台」にたとえている。その比喩を借りた象徴。
```
Shot S4-B, 4 seconds. Slow dolly-in on a vintage telephone switchboard panel with rows of
plain cables and unlabeled jacks, softly lit in gold against navy. Midway, the camera glides
past it toward a glowing floor plan-like map hovering beyond, suggesting a bigger picture
than simple connections. No text, no people. Calm, reflective. Vertical 9:16.
```

### S4-C（6 秒）— 再現性への疑問（結論を断定しない）
メモ：放射状の通路は、サンバースト迷路の概念図。**結果（割合など）は映さない**。
```
Shot S4-C, 6 seconds. Slow top-down rotation over a stylized radial corridor layout, like
spokes of a wheel, on a dark surface. A small stylized white rat pauses at the center,
looks around, and walks toward one spoke, then hesitates and turns toward another.
Faint gold lines trace several possible paths, some overlapping, none highlighted as
correct. No numbers, no text. Uncertain, questioning mood; the animal is safe and unharmed.
Vertical 9:16.
```

### S5-A（7 秒）— スキナーの『言語行動』
メモ：**書名・表紙の文字は出さない**。本そのものを象徴にする。
```
Shot S5-A, 7 seconds. Slow push-in on a single closed hardcover book with a plain dark
cloth cover, no title, no lettering, resting on a desk under warm lamplight. A few pages
turn on their own in a soft breeze and settle; faint abstract soundwave-like ripples of
gold light rise from the pages and spread across the dark room, evoking language. No
people. Navy background, quiet, scholarly mood. Vertical 9:16.
```

### S5-B（4 秒）— 批判的な書評（手だけ）
メモ：人物を出さず、手と紙だけ。「厳しさ」を強調しない（台本の方針）。
```
Shot S5-B, 4 seconds. Close-up, steady camera with a slow lateral drift. Two hands (no
faces) place a thin bundle of printed pages beside a closed book and make a few small
pencil marks in the margin; the pages have only blurred, unreadable text. Neutral cool
light with a gold accent. Measured, analytical, not hostile. Vertical 9:16.
```

### S5-C（3 秒）— 評価は立場によって分かれる
メモ：「どちらが正しい」を示さない。2つの光が反対を指して、釣り合う。
```
Shot S5-C, 3 seconds. Slow static shot of a balanced scale made of thin brass, in a dark
space, with two beams of light shining from opposite directions across it, one gold and one
cool blue, neither dominating. The scale trembles gently and stays level. No text, no
people. Quiet, undecided mood. Vertical 9:16.
```

### S6-A（6 秒）— 認知革命（1950年代以降）
メモ：言語学・神経科学・計算機科学が心への関心を高めた（教科書の記述）。**3つが合流する抽象映像**。文字なし。
```
Shot S6-A, 6 seconds. Slow upward camera move through a dark space where three streams of
small glowing points (one gold, one cool blue, one pale cream) drift in from different
directions and converge into a gently pulsing network of connected nodes, like an
abstract mind forming. No text, no recognizable human figure, no screens with writing.
Elegant, hopeful, forward-looking mood. Vertical 9:16.
```

## 4. 生成したあとの確認（1 本ごと）

- [ ] 文字・数字・ロゴが、映っていない（崩れた文字も不可）
- [ ] 実在の人物に見える顔が、ない
- [ ] 動物（ラット）が、傷ついたり苦しんだりして見えない
- [ ] 台本にない主張を、映像が示していない（例：結果の数字、勝ち負け、「誰が正しい」という含み）
- [ ] 上 15%・下 25% が、静かで、字幕が読める
- [ ] 点滅・急なカットが、ない
- [ ] 時代の違う物が混ざっていない（現代のスマホ、ノートPC など。S6-A は、抽象のみ）

## 5. 動画に組み込む手順（Remotion）

1. 生成した動画を、`video/clips-in/ep02/S1-A.mp4` のように、ショット ID で名前を付けて置く（元ファイル。Git には入れない）。
2. `node tools/check_clips.mjs --normalize` で、720x1280・30fps・音声なしに揃えて `video/public/video/ep02/` に出す（約 1〜2 MB。**これは Git に入れる**。新しい環境でも描画できるように）。
3. `video/src/ep02/clips.ts` に、場面 ID とクリップの対応を書く（実装済み。映像は `Ep02.tsx` の `Backdrop` で、暗く（不透明度 約 0.58）重ね、上を暗くして年表の読みやすさを保つ）。
4. 長さが足りないショットは、最後のフレームを静止、または 3〜5% の緩やかな拡大で間を持たせる（`docs/motion-guidelines.md`）。
5. `node tools/qa.mjs` と `node tools/sheet.mjs`（コンタクトシート）で、文字の重なりと、字幕の可読性を確認する。
6. 概要欄とクレジット：`docs/credits.md` に「映像の一部に Gemini（Google）で生成した映像を使用」と、使用日・使ったモデル名を記録する。**各社の利用規約・商用利用・AI 表示ルールは未確認。公開前に確認する。**

## 6. 保存と、Claude による確認

Gemini の画面は、このリポジトリに直接書き込めない。次の流れで、ファイルとして保存して、確認できる状態にする。

**① Gemini で（§1 の DELIVERY RULES による）**
- ファイル名を、ショット ID（`S1-A.mp4` など）にして、ダウンロードする。
- 1 本ごとに出る LOG（使ったプロンプト、長さ、自己チェック）を、`S1-A.log.txt` のように、動画の横に保存する（コピーして貼り付けるだけでよい）。
- 全部できたら「manifest」と送り、出た表を `manifest.txt` に保存する。

**② 動画を、私（Claude）に渡す（いずれか）**
| 方法 | 手順 | 備考 |
|---|---|---|
| A. チャットに添付 | 動画（と LOG）を、このセッションのチャットに添付して送る | いちばん簡単。添付した動画を、私がこの環境で開けるかは、**未確認**（試して、だめなら B か C） |
| B. Google ドライブ | フォルダを作って、動画を入れ、共有リンクを送る | 私がドライブから読めるかは、**未確認** |
| C. このリポジトリ | `clips/ep02/` に動画を置いて、ブランチ `clips/ep02` に push する（1 本 5 MB 以下に圧縮：`ffmpeg -i in.mp4 -vf scale=540:960 -crf 30 -an out.mp4`） | 確実に読める。容量が大きくなるので、使い終わったらブランチを消す |

**③ 確認（私、または手元で）**
```bash
cd video
mkdir -p clips-in/ep02            # ここにクリップを置く（Git には入れない）
node tools/check_clips.mjs        # 有無・縦横比・長さ・fps を確認。確認用の画像 out/clips/sheet-*.png を出す
node tools/check_clips.mjs --normalize   # 1080x1920・30fps・音声なしに整えて public/video/ep02/ に出す
```
- 自動で判定できるのは、ファイルの有無・縦横比・長さ・音声の有無・fps だけ。**文字・顔・動物の描写・字幕の領域は、確認用の画像を見て、人（または私）が判断する。**
- 私が確認するときは、確認用の画像（各クリップの 4 コマ）と、LOG の自己チェックを突き合わせて、§4 のチェックリストに沿って報告する。LOG は Gemini の自己申告なので、**画像での確認を省かない。**
- 作り直すものは、`manifest.txt` の `redo` と私の報告を合わせて決める。

## 7. うまくいかないとき

| 症状 | 対処 |
|---|---|
| 文字が映ってしまう | プロンプトの先頭に「no text anywhere in the frame」を足す。それでも出たら、その部分を暗くぼかして使う、またはそのショットを撮り直す |
| 人の顔が出る | 「no people, hands only, seen from behind」と明記する。必要なら、主題を物だけにする |
| 動きが速い・カットが入る | 「one continuous shot, slow, steady, no cuts」を足す |
| 色が合わない | 前置きの STYLE を、各ショットの先頭にも付ける。色コードを、色の名前（deep navy, warm gold, cream）に言い換える |
| 長さが指定できない | 短い方を採用する。長い場面は、Remotion で静止・拡大 |
