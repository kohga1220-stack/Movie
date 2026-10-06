"""ナレーション音声と、字幕・映像のタイミング（src/timing.json）を作る。

音声合成は VOICEVOX（voicevox_core 0.16）。話者の既定は「青山龍星（ノーマル）」。
クレジット表記が必須：「VOICEVOX:青山龍星」（docs/credits.md 参照）。

使い方（Python 3.10+）:
    bash tools/setup_voicevox.sh                      # 初回のみ。必要なファイルを取得
    pip install .voicevox/voicevox_core-*.whl pyopenjtalk-plus numpy scipy
    python tools/gen_narration.py

読み方の修正: src/script.json の各文に "tts" を書くと、字幕とは別に、読み上げ用の文を指定できる。
生成のたびに、docs/narration-readings.md へ「文 → 読み（カナ）」の一覧を出力する。
"""
import io
import json
import math
import pathlib

import numpy as np
import pyopenjtalk  # 辞書（NAIST Japanese Dictionary）の取得元として使う
from scipy.io import wavfile
from voicevox_core.blocking import Onnxruntime, OpenJtalk, Synthesizer, VoiceModelFile

ROOT = pathlib.Path(__file__).resolve().parent.parent
VV = ROOT / ".voicevox"
FPS = 30

# ---- 話者と声の調整 ----
SPEAKER = "青山龍星"
STYLE_ID = 13  # 青山龍星（ノーマル）。玄野武宏（ノーマル）は 11（VVM 4）
VVM = "15.vvm"  # STYLE_ID を含む VVM（青山龍星 = 15、玄野武宏 = 4）
SPEED = 1.0  # 話す速さ
PITCH = 0.0  # 音の高さ
INTONATION = 1.15  # 抑揚（大きいほど抑揚が強い）
PAUSE = 0.9  # 句読点の間の長さ
# ---- 動画のタイミング（秒）----
LEAD, GAP, TAIL, MIN_SCENE = 0.45, 0.3, 0.6, 3.0
PEAK = 0.8  # 最大振幅（0〜1）

ort = Onnxruntime.load_once(filename=str(VV / "voicevox_onnxruntime-linux-x64-1.17.3" / "lib" / "libvoicevox_onnxruntime.so.1.17.3"))
ojt = OpenJtalk(str(pathlib.Path(pyopenjtalk.__file__).parent / "dictionary"))
synth = Synthesizer(ort, ojt)
with VoiceModelFile.open(str(VV / "vvm" / VVM)) as model:
    synth.load_voice_model(model)

script = json.loads((ROOT / "src" / "script.json").read_text(encoding="utf-8"))
out_dir = ROOT / "public" / "audio" / "narration"
out_dir.mkdir(parents=True, exist_ok=True)

timing = {"fps": FPS, "scenes": [], "totalFrames": 0}
readings = ["# ナレーションの読み（自動生成）\n", f"話者：{SPEAKER}（VOICEVOX）。`／` はアクセント句の区切り。読み間違いは `src/script.json` の `tts` で直す。\n",
            "| 字幕 | 読み上げ文 | 読み（カナ） |", "|---|---|---|"]
for s_idx, scene in enumerate(script["scenes"]):
    chunks, t = [], LEAD
    for c_idx, chunk in enumerate(scene["chunks"]):
        text = chunk.get("tts", chunk["text"])
        q = synth.create_audio_query(text, STYLE_ID)
        q.speed_scale, q.pitch_scale, q.intonation_scale, q.pause_length_scale = SPEED, PITCH, INTONATION, PAUSE
        q.pre_phoneme_length, q.post_phoneme_length = 0.05, 0.1
        kana = "／".join("".join(m.text for m in ap.moras) + ("、" if ap.pause_mora else "") for ap in q.accent_phrases)
        readings.append(f"| {chunk['text']} | {text if text != chunk['text'] else '（同じ）'} | {kana} |")
        sr, x = wavfile.read(io.BytesIO(synth.synthesis(q, STYLE_ID)))
        x = x.astype(np.float64) / 32768.0
        x = x / max(1e-9, np.abs(x).max()) * PEAK
        fade = int(sr * 0.008)
        x[:fade] *= np.linspace(0, 1, fade)
        x[-fade:] *= np.linspace(1, 0, fade)
        name = f"{s_idx + 1:02d}-{c_idx + 1}.wav"
        wavfile.write(out_dir / name, sr, (x * 32767).astype(np.int16))
        dur = len(x) / sr
        chunks.append({"file": f"audio/narration/{name}", "startFrame": round(t * FPS), "frames": math.ceil(dur * FPS), "seconds": round(dur, 3)})
        t += dur + GAP
    seconds = max(MIN_SCENE, t - GAP + TAIL)
    frames = math.ceil(seconds * FPS)
    timing["scenes"].append({"id": scene["id"], "frames": frames, "chunks": chunks})
    timing["totalFrames"] += frames

(ROOT / "src" / "timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=2), encoding="utf-8")
(ROOT.parent / "docs" / "narration-readings.md").write_text("\n".join(readings) + "\n", encoding="utf-8")
print(f"total {timing['totalFrames']} frames = {timing['totalFrames'] / FPS:.1f} s")
for sc in timing["scenes"]:
    print(sc["id"], sc["frames"], [c["frames"] for c in sc["chunks"]])
