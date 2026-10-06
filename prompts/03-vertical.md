# ステップ3：モバイル用縦型（9:16）アダプテーション

横型マスター（`SaaSDemo`）の完成後に貼り付ける。SNS・ポートフォリオ展開用に、再レイアウトした縦型動画を生成させる。

```
Now create a vertical adaptation named `SaaSDemoVertical` (1080x1920, 30 fps, 450 frames).

Requirements:
- Do not merely center-crop or scale down the 16:9 canvas.
- Re-layout the UI components vertically: stack the fragmented cards comfortably within the vertical canvas, scale typography for mobile legibility, and adjust cursor animation paths accordingly.
- Keep the identical 450-frame timing, copy, audio cues, and transitions as approved in `SaaSDemo`.
- Render the final output to `out/SaaSDemoVertical.mp4` using `npx remotion render`.
- Verify both outputs with `ffprobe`: horizontal (`1920x1080`) and vertical (`1080x1920`), each exactly 450 frames at 30 fps with an audio stream.
- Check for visual overflow by rendering stills (`npx remotion still`) at the key frames of the storyboard (e.g. 0, 89, 150, 209, 300, 449) and confirming no text or card is clipped at the canvas edges.
```
