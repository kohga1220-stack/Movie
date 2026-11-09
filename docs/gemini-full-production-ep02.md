# 第2話 — Gemini に映像のすべてを任せる制作パッケージ

**分担**
| 担当 | 内容 |
|---|---|
| **Claude（私）** | 調査、台本、主張と出典の表（`docs/episode-02-behaviorism.md`）、このプロンプト、受け取ったクリップの確認・つなぎ・音量調整・品質確認、記録（クレジット） |
| **Gemini** | 映像、ナレーション音声（日本語）、画面の文字（題名・タグ・字幕）、環境音／BGM の雰囲気 |
| **あなた** | Gemini にプロンプトを貼る、できたクリップを添付する、**公開前の確認（事実・声の読み・AI表示）** |

**先に知っておくこと（正直な申告）**
- Gemini は、この環境から呼び出せない。クリップは、**あなたが貼って、添付で戻す**必要がある（全 10 本）。
- 動画生成は 1 本 数秒〜10 秒が目安。**全体（約 80〜85 秒）は、10 本に分けて作り、私がつなぐ。** 1 本で全体を作らせる指示は、品質が不安定になるため、勧めない。
- **画面の文字（日本語）と音声の読みは、動画生成が苦手。** 崩れたら、そのクリップだけ 1〜2 回やり直す。直らなければ、その文字だけ私が後から重ねる（文字を重ねるための仕組みは、すでにある）。
- **私は音声を聴けない。** ナレーションが台本どおりか、読み（人名など）が正しいかは、あなたが聴いて確認する。クリップごとの LOG（「台本どおりに読んだか」の自己申告）は、補助にすぎない。
- 公開前のゲート（台本の事実確認、AI 表示ルール、利用規約）は、変わらず必要。

---

## 1. 最初に 1 回貼る指示（マスター）

```
You are the sole video producer for a Japanese educational vertical short (history of
psychology, episode 2). I will send ONE CLIP PROMPT at a time (10 clips in total, C01..C10).
Generate each clip exactly as specified, including the Japanese voice-over and the
on-screen Japanese text. The clips will be joined later by someone else, so every clip must
share one consistent look and sound.

GLOBAL RULES (apply to every clip):
FORMAT
- Native vertical 9:16, full-frame. NO letterboxing, NO blurred extension of the sides or
  top/bottom, NO visible seams or bands. Highest resolution available. 24-30 fps.
- Length as specified in each clip. One continuous shot, no cuts, no flashing.
LOOK
- Cinematic, restrained documentary-illustration look. Deep navy-black background (#12151b),
  warm gold accent light (#d9a441), aged-paper cream (#ece3cf). Soft volumetric light,
  shallow depth of field, very subtle film grain, muted colors. Calm, thoughtful mood.
- NEVER depict a real, identifiable person. No faces: use hands, backs, silhouettes, objects,
  places, abstract light. These are symbolic illustrations, not archival footage.
- No animal harm. No gore. No logos, no watermarks, no brand names.
- Keep the focal action in the middle 55% of the frame height. The top 15% and bottom 25%
  must stay calm and darker so text stays readable.
ON-SCREEN TEXT (Japanese, must be spelled EXACTLY as given; never invent or alter characters)
- Title: top-left, inside the safe area, bold Japanese serif (Mincho), cream color, with a soft shadow.
- Tag: top-right, a small rounded rectangle outline in gold with the given word inside.
- Caption (subtitle): bottom area (about 70-82% down the frame), centered, 2 lines max,
  Japanese serif, cream color, on a faint dark gradient. The caption shows the same sentence
  that is being spoken, appearing as it is spoken.
- Any other text appears only if the clip prompt lists it. No other letters or numbers anywhere
  (no text on book covers, signs, screens or papers; keep those blank or blurred).
VOICE
- One calm, low, clear adult male Japanese narrator (documentary style), natural pace,
  a short pause after each sentence. Same voice in every clip. Read the Japanese EXACTLY as
  written, with the pronunciation hints given. Do not add, drop or paraphrase any words.
SOUND
- Under the voice: very quiet, slow ambient music (sparse plucked-string and low drone
  feel, no drums, no melody that competes with the voice) and subtle room tone.
  No sudden loud sounds.
AFTER EACH CLIP print this LOG block (plain text):
  CLIP: <id>
  PROMPT_USED: <verbatim>
  DURATION_SEC / ASPECT / HAS_VOICE: <values or unknown>
  VOICE_SPOKEN_VERBATIM: yes / no / unsure   (compare with the VOICE lines)
  ONSCREEN_TEXT_CORRECT: yes / no / unsure   (compare with the TEXT lines, character by character)
  READABLE_OTHER_TEXT: yes / no
  REAL_PERSON_FACE: yes / no
  ANIMAL_HARMED: yes / no
  LETTERBOX_OR_SEAMS: yes / no
  NOTES: <one line>
Never write "pass" if any answer is "unsure". If something fails, regenerate once with the fix.
Reply "ready" and wait for C01.
```

発音ヒント（各クリップに入れてある）：論文＝ろんぶん／内観＝ないかん／予測＝よそく／制御＝せいぎょ／新行動主義＝しんこうどうしゅぎ／認知地図＝にんちちず／迷路＝めいろ／再現性＝さいげんせい／書評＝しょひょう／言語行動＝げんごこうどう／認知革命＝にんちかくめい／ワトソン／ハル／トールマン／スキナー／チョムスキー（いずれも、外国人名のカタカナ読み）。

---

## 2. クリップ別プロンプト（C01〜C10）

各ブロックを、§1 のあとに 1 本ずつ貼る。`VOICE` は、台本（`video/src/ep02/script.json`）と同じ文。`TEXT` は、画面に出す日本語の文字列（一字一句）。
映像の内容は、台本の主張（`docs/episode-02-behaviorism.md` の表）を超えない象徴にしてある。

### C01（約 10 秒）— 1913年の論文　［主張 1］
```
CLIP C01, about 10 seconds, vertical 9:16 full-frame.
VISUAL: Slow push-in on a dark wooden desk lit by a brass lamp (warm gold light from the left,
navy shadows, drifting dust motes). A stack of four closed books with plain, unmarked spines.
One hand (no face) lifts the top book's cover and opens it; the pages are blank cream paper
with only soft blurred smudges. The open book fills the middle of the frame by the end.
TEXT: Title (top-left): 1913年の論文   Tag (top-right): 原典
      Caption 1 (0.5-5.5 s): 1913年、ある論文が、心理学の向かう先を変えようとしました。
      Caption 2 (6.5-9.5 s): 書いたのは、ジョン・ワトソンです。
VOICE (0.5 s start): 1913年、ある論文が、心理学の向かう先を変えようとしました。 [pause]
      書いたのは、ジョン・ワトソンです。   (ろんぶん / しんりがく / ワトソン)
```

### C02（約 8 秒）— 行動主義の宣言①　［主張 2］
```
CLIP C02, about 8 seconds, vertical 9:16 full-frame.
VISUAL: Slow lateral dolly along a long laboratory bench in a dim, orderly room: glass flasks,
brass instruments, a mechanical recording drum with a paper strip slowly moving, all without
any readable markings. Cool blue-white window light with warm gold highlights on brass. No people.
TEXT: Title (top-left): 行動主義の宣言   Tag (top-right): 原典
      Caption (0.5-7 s): 論文は、心理学を、純粋に客観的な、実験的な自然科学の一分野だと述べました。
VOICE (0.5 s start): 論文は、心理学を、純粋に客観的な、実験的な自然科学の一分野だと述べました。
      (ろんぶん / しんりがく / じゅんすいに きゃっかんてきな / じっけんてきな / しぜん かがく / いちぶんや)
```

### C03（約 7 秒）— 行動主義の宣言②　［主張 3・4］
```
CLIP C03, about 7 seconds, vertical 9:16 full-frame.
VISUAL: Macro close-up with a very slow push-in on a brass gauge whose thin needle sweeps and
settles precisely on a mark (dial has plain tick marks, no numbers or letters). Then a slow
pull-back from a small dim room where a desk lamp fades out, revealing a bright window and an
orderly laboratory beyond. Gold rim light, navy background. No people. Calm, controlled.
TEXT: Title (top-left): 行動主義の宣言   Tag (top-right): 原典
      Caption 1 (0.4-3 s): 目標は、行動の予測と制御。
      Caption 2 (3.6-6.5 s): 内観に頼る心理学を、批判したのです。
VOICE (0.4 s start): 目標は、行動の予測と制御。 [pause] 内観に頼る心理学を、批判したのです。
      (もくひょうは / こうどうの よそくと せいぎょ / ないかんに たよる / ひはん)
```

### C04（約 8.5 秒）— 新行動主義①　［主張 5］
```
CLIP C04, about 8.5 seconds, vertical 9:16 full-frame.
VISUAL: Aerial slow glide over a dark abstract landscape: a single river of gold light splits into
two streams and curves in a new direction. Then a slow side-to-side camera move across a dark
table with two objects: left, a brass mechanical apparatus with gears; right, an old paper with
plain abstract lines (no writing). Warm gold grazing light, navy background. No people.
TEXT: Title (top-left): 新行動主義   Tag (top-right): 諸説
      Caption 1 (0.4-5.2 s): その後、1930〜40年代に「新行動主義」が登場します。
      Caption 2 (5.8-8 s): 代表は、ハルとトールマンです。
VOICE (0.4 s start): その後、1930〜40年代に「新行動主義」が登場します。 [pause]
      代表は、ハルとトールマンです。   (せんきゅうひゃく さんじゅう よんじゅうねんだいに / しんこうどうしゅぎ / ハル / トールマン)
```

### C05（約 5 秒）— 新行動主義②　［主張 6］
```
CLIP C05, about 5 seconds, vertical 9:16 full-frame.
VISUAL: Slow push-in toward a fork in a misty path at dusk: one path in solid gold light, the other
in faint dashed light, with a blank wooden signpost (no writing) at the fork. Navy twilight, soft fog,
quiet uncertain mood. No people.
TEXT: Title (top-left): 新行動主義   Tag (top-right): 諸説
      Caption (0.4-4.5 s): ただし、スキナーを含めるかは、資料によって違います。
VOICE (0.4 s start): ただし、スキナーを含めるかは、資料によって違います。 (スキナー / しりょうによって ちがいます)
```

### C06（約 8 秒）— 認知地図①　［主張 7］
```
CLIP C06, about 8 seconds, vertical 9:16 full-frame.
VISUAL: Slow top-down crane shot over a stylized miniature maze with clean low walls on a dark
surface. A small stylized white rat walks calmly through the corridors, safe and unharmed. As it
moves, a faint glowing gold map of the whole maze gradually draws itself in the air above the
maze, like a memory taking shape. Soft lighting, shallow depth of field. Gentle, curious mood.
TEXT: Title (top-left): 認知地図   Tag (top-right): 原典
      Small note (bottom of the middle area, small): 概念図（イメージ）
      Caption (0.4-7.2 s): トールマンは1948年の論文で、ラットが迷路の「認知地図」を学ぶと論じました。
VOICE (0.4 s start): トールマンは1948年の論文で、ラットが迷路の「認知地図」を学ぶと論じました。
      (トールマンは / せんきゅうひゃく よんじゅうはちねんの ろんぶんで / ラットが / めいろの にんちちず / まなぶと ろんじました)
```

### C07（約 10 秒）— 認知地図②　［主張 8・9］
```
CLIP C07, about 10 seconds, vertical 9:16 full-frame.
VISUAL: First (about 4 s): slow dolly-in on a vintage telephone switchboard panel with rows of plain
cables and unlabeled jacks in gold light against navy, then the camera glides past it toward a glowing
floor-plan-like map hovering beyond. Then (about 6 s): slow top-down rotation over a stylized radial
corridor layout like wheel spokes; a small stylized white rat pauses at the center, walks toward one
spoke, hesitates and turns toward another; faint gold lines trace several possible paths, none
highlighted as correct. The animal is safe and unharmed. No text, no numbers in the image.
TEXT: Title (top-left): 認知地図   Tag (top-right): 原典
      Small note (small): 概念図（イメージ）
      Caption 1 (0.4-3.6 s): 刺激と反応だけでは説明できない、という立場です。
      Caption 2 (4.4-9.5 s): ただし、この迷路実験の再現性には、2026年のレビューが疑問を示しています。
VOICE (0.4 s start): 刺激と反応だけでは説明できない、という立場です。 [pause]
      ただし、この迷路実験の再現性には、2026年のレビューが疑問を示しています。
      (しげきと はんのうだけでは せつめいできない / たちばです / めいろじっけんの さいげんせいには / にせんにじゅうろくねんの レビューが ぎもんを しめして います)
```

### C08（約 8 秒）— 言語行動①　［主張 10］
```
CLIP C08, about 8 seconds, vertical 9:16 full-frame.
VISUAL: Slow push-in on a single closed hardcover book with a plain dark cloth cover (no title, no
lettering) on a desk under warm lamplight. A few pages turn on their own in a soft breeze and settle;
faint abstract soundwave-like ripples of gold light rise from the pages and spread across the dark
room, evoking language. No people. Navy background, quiet scholarly mood.
TEXT: Title (top-left): 言語行動   Tag (top-right): 諸説
      Caption (0.4-7.4 s): スキナーは1957年の『言語行動』で、言語も行動主義で説明しようとしました。
VOICE (0.4 s start): スキナーは1957年の『言語行動』で、言語も行動主義で説明しようとしました。
      (スキナーは / せんきゅうひゃく ごじゅうななねんの / げんごこうどう / げんごも こうどうしゅぎで せつめい しようと しました)
```

### C09（約 8 秒）— 言語行動②　［主張 11・12］
```
CLIP C09, about 8 seconds, vertical 9:16 full-frame.
VISUAL: Close-up, steady camera with a slow lateral drift: two hands (no faces) place a thin bundle of
printed pages beside a closed book and make a few small pencil marks in the margin; the pages have
only blurred, unreadable smudges. Neutral cool light with a gold accent; measured, analytical, not
hostile. Then a slow static shot of a balanced brass scale in a dark space with two beams of light from
opposite directions across it, one gold and one cool blue, neither dominating; the scale stays level.
TEXT: Title (top-left): 言語行動   Tag (top-right): 諸説
      Caption 1 (0.4-4 s): 1959年、チョムスキーが批判的な書評を書きます。
      Caption 2 (4.6-7.5 s): この書評の評価は、立場によって分かれます。
VOICE (0.4 s start): 1959年、チョムスキーが批判的な書評を書きます。 [pause] この書評の評価は、立場によって分かれます。
      (せんきゅうひゃく ごじゅうきゅうねん / チョムスキーが ひはんてきな しょひょうを かきます / しょひょうの ひょうかは たちばによって わかれます)
```

### C10（約 10 秒）— 認知革命　［主張 13］
```
CLIP C10, about 10 seconds, vertical 9:16 full-frame.
VISUAL: Slow upward camera move through a dark space where three streams of small glowing points
(one gold, one cool blue, one pale cream) drift in from different directions and converge into a
gently pulsing network of connected nodes, like an abstract mind forming. No recognizable human
figure, no screens with writing. Elegant, hopeful, forward-looking. In the last 2 seconds the
image slowly settles and darkens slightly (a quiet ending).
TEXT: Title (top-left): 認知革命
      Caption 1 (0.4-6.2 s): 1950年代以降、心の働きに目を向ける「認知革命」が起こったとされます。
      Caption 2 (6.8-9.3 s): 出典は、概要欄に載せています。
VOICE (0.4 s start): 1950年代以降、心の働きに目を向ける「認知革命」が起こったとされます。 [pause]
      出典は、概要欄に載せています。   (せんきゅうひゃく ごじゅうねんだい いこう / こころの はたらきに めを むける / にんちかくめい / おこったと されます / しゅってんは がいようらんに のせて います)
```

---

## 3. できたクリップを受け取ったあと（Claude が行う）

1. 動画と LOG を、このチャットに添付してもらう（添付は、私が開けることを確認済み）。
2. クリップを `video/clips-in/ep02-full/C01.mp4` 〜 `C10.mp4` の名前で置き（私が取り込む）、`node tools/check_clips.mjs clips-in/ep02-full --full` で、縦横比・長さ・fps・音声の有無を確認し、確認用の画像（各クリップ 4 コマ）で、**継ぎ目・文字の崩れ・顔・動物**を目視する。
3. `node tools/assemble_clips.mjs`（実装・動作確認済み。合成クリップでテスト）で、10 本をつなぎ（0.3 秒のつなぎ目の溶かし）、音量を -14 LUFS に整えて、`out/ep02-gemini.mp4` を作る。
4. 文字が崩れたクリップは、やり直しの指示を出す。直らない文字は、私が重ねる。
5. **あなたが聴く**：ナレーションが台本どおりか、人名の読みが正しいか、声が全クリップで同じか。
6. クレジットを、`docs/credits.md` に記録する。

## 4. 使い分け（品質か、手間か）

| 方式 | 映像 | 音声 | 画面の文字 | 手間 | 備考 |
|---|---|---|---|---|---|
| **A. このパッケージ（全部 Gemini）** | Gemini | Gemini | Gemini（崩れたら私が重ねる） | クリップ 10 本の生成と添付 | 読みの確認は、聴くしかない |
| B. 映像だけ Gemini | Gemini（`docs/gemini-video-prompts-ep02.md`） | VOICEVOX（自作） | 私が重ねる（正確） | 同じ 15 本 | 文字と読みが確実。第2話の場面1は、この方式で組み込み済み |

**迷ったら B。** 文字と読みの誤りが、事実の誤りとして見えるのを避けられる。A は、手間が少ないが、公開前の確認が、より重要になる。
