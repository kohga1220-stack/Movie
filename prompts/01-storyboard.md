# ステップ1：ストーリーボードと設計仕様の策定

コードを書かせず、フレーム単位のタイムライン設計と仕様書（Markdown）を作らせるプロンプト。
生成された `storyboard.md` を確認・承認してから、ステップ2に進む。

```
Read the installed Remotion project and skills. We are building an original, high-converting SaaS product demo video (15 seconds, 1920x1080, 30 fps, total 450 frames).

Before writing any React or Remotion code, generate three planning documents:
1. brief.md: Target audience, key value proposition, visual tone, and structural boundaries.
2. style-guide.md: Color palette (2 primary/accent colors + neutral background/surface tokens), typography scales, spacing tokens, and motion guidelines.
3. storyboard.md: Frame-by-frame timeline mapping (0–450 frames).

Timeline requirements:
- Frames 0–89: 3 fragmented cards representing scattered data (e.g., Ads, Social, Web) with the headline "Too many tabs."
- Frames 90–209: A smooth cursor action selects and transitions the cards toward a unified dashboard.
- Frames 210–359: The cards seamlessly merge into a single clear view with the headline "One clear view."
- Frames 360–449: Final call-to-action lockup holding "Explore the demo."

Constraints:
- Maintain a subtle "Concept Demo" watermark badge throughout.
- Do not use copyrighted trademarks or fake data claims.
- Explicitly map exact frame ranges, transitions, and audio cue positions in storyboard.md.
- Halt and display storyboard.md for my review before generating any component code.
```
