"""ナレーション音声と、字幕・映像のタイミング（src/timing.json）を作る。

使い方（Python 3.10+）:
    pip install pyopenjtalk-plus numpy scipy
    python tools/gen_narration.py

音声合成: Open JTalk（pyopenjtalk-plus）＋ HTS Voice "Mei"（MMDAgent Project Team、CC BY 3.0）。
クレジット表記が必要。docs/credits.md を参照。
"""
import json
import math
import pathlib

import numpy as np
import pyopenjtalk
from scipy.io import wavfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS = 30
SPEED = 1.15  # 話す速さ（1.0 が標準）
HALF_TONE = -1.0  # 音の高さ（半音単位。マイナスで低くなる）
LEAD, GAP, TAIL, MIN_SCENE = 0.45, 0.25, 0.6, 3.0  # 秒
PEAK = 0.8  # 最大振幅（0〜1）

script = json.loads((ROOT / "src" / "script.json").read_text(encoding="utf-8"))
out_dir = ROOT / "public" / "audio" / "narration"
out_dir.mkdir(parents=True, exist_ok=True)

timing = {"fps": FPS, "scenes": [], "totalFrames": 0}
for s_idx, scene in enumerate(script["scenes"]):
    chunks, t = [], LEAD
    for c_idx, chunk in enumerate(scene["chunks"]):
        x, sr = pyopenjtalk.tts(chunk.get("tts", chunk["text"]), speed=SPEED, half_tone=HALF_TONE)
        x = x.astype(np.float64)
        x = x / max(1.0, np.abs(x).max()) * PEAK
        # 先頭・末尾の無音を整える（短いフェードで、ぷつっという音を防ぐ）
        fade = int(sr * 0.01)
        x[:fade] *= np.linspace(0, 1, fade)
        x[-fade:] *= np.linspace(1, 0, fade)
        name = f"{s_idx + 1:02d}-{c_idx + 1}.wav"
        wavfile.write(out_dir / name, sr, (x * 32767).astype(np.int16))
        dur = len(x) / sr
        chunks.append(
            {
                "file": f"audio/narration/{name}",
                "startFrame": round(t * FPS),
                "frames": math.ceil(dur * FPS),
                "seconds": round(dur, 3),
            }
        )
        t += dur + GAP
    seconds = max(MIN_SCENE, t - GAP + TAIL)
    frames = math.ceil(seconds * FPS)
    timing["scenes"].append({"id": scene["id"], "frames": frames, "chunks": chunks})
    timing["totalFrames"] += frames

(ROOT / "src" / "timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"total {timing['totalFrames']} frames = {timing['totalFrames'] / FPS:.1f} s")
for sc in timing["scenes"]:
    print(sc["id"], sc["frames"], [c["frames"] for c in sc["chunks"]])
