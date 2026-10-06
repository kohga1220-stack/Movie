# ステップ2：コンポーネント実装とプレビュー生成

`storyboard.md` を承認した後に貼り付ける。Remotion コンポジションを実装させ、プレビュー動画を出力させる。

```
The storyboard.md is approved. Now implement the composition as a registered Remotion composition named `SaaSDemo` (1920x1080, 30 fps, 450 frames).

Implementation rules:
- Strictly separate UI/data/theme config from motion logic (keep copy, colors, and asset constants in a dedicated config file).
- Drive all motion strictly through `useCurrentFrame` and `useVideoConfig`. Do not use `setInterval`, `setTimeout`, or unseeded random values.
- For the card gathering and layout transitions, use Remotion's `spring()` utility with baseline values: `mass: 1`, `stiffness: 180`, `damping: 22`. Tune for a snappy, premium feel without excessive oscillation.
- Keep layout elements stable during reading phases; avoid animating everything at once.
- Synthesize or configure short, subtle local WAV audio cues for key interaction frames (click, card shift, UI settle) and wire them with the `<Audio>` component from `remotion`, using `<Sequence>` to start each cue at its storyboard frame.

Verification steps:
1. Run TypeScript check and linter. Fix any typing errors.
2. Render a preview video (`preview.mp4`) and a contact sheet image capturing key scene transitions.
3. Inspect output specifications with `ffprobe`: exact frame count (450), resolution (1920x1080), frame rate (30 fps), and presence of an audio stream.
4. List the rendered command and asset details in `README.md`.
```
