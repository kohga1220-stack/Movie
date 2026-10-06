"""BGM と効果音を、すべてスクリプトで合成する（外部の音源は使わない＝ライセンス上の問題なし）。

使い方:
    pip install numpy scipy
    python tools/gen_bgm.py      # 先に tools/gen_narration.py で src/timing.json を作っておく

構成: 低いドローン（D・A）＋ 琴風のつまびき（陰旋法 D Eb G A Bb、擬似乱数は固定シード）
      ＋ ごく小さな太鼓の脈動 ＋ 残響。
"""
import json
import pathlib

import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve, lfilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 44100
out_dir = ROOT / "public" / "audio"
out_dir.mkdir(parents=True, exist_ok=True)

timing = json.loads((ROOT / "src" / "timing.json").read_text(encoding="utf-8"))
total = timing["totalFrames"] / timing["fps"] + 1.5
n = int(total * SR)
rng = np.random.default_rng(7)


def midi_hz(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def pluck(freq: float, dur: float, decay: float = 0.996) -> np.ndarray:
    """Karplus–Strong 法の撥弦音。"""
    period = int(round(SR / freq))
    length = int(dur * SR)
    x = np.zeros(length)
    x[:period] = rng.uniform(-1, 1, period)
    a = np.zeros(period + 2)
    a[0] = 1.0
    a[period] = -decay * 0.5
    a[period + 1] = -decay * 0.5
    y = lfilter([1.0], a, x)
    return y / (np.abs(y).max() + 1e-9)


def add(buf: np.ndarray, sig: np.ndarray, at: float, gain: float, pan: float = 0.5) -> None:
    i = int(at * SR)
    j = min(buf.shape[1], i + len(sig))
    if i >= buf.shape[1]:
        return
    seg = sig[: j - i]
    buf[0, i:j] += seg * gain * (1 - pan)
    buf[1, i:j] += seg * gain * pan


def taiko(dur: float = 1.2) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    f = 55 + 70 * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    click = rng.normal(0, 1, len(t)) * np.exp(-t * 60) * 0.25
    return body + click


# ---- BGM ----
bgm = np.zeros((2, n))
t_all = np.arange(n) / SR
lfo = 0.65 + 0.35 * np.sin(2 * np.pi * 0.07 * t_all)
for m, g, det in [(38, 0.5, 0.0), (45, 0.32, 0.0), (50, 0.2, 0.0), (45, 0.16, 0.6)]:
    f = midi_hz(m) + det
    drone = np.sin(2 * np.pi * f * t_all) + 0.25 * np.sin(2 * np.pi * 2 * f * t_all)
    bgm += (drone * lfo * g * 0.18)[None, :]

scale = [0, 1, 5, 7, 8]  # D Eb G A Bb
degree = 7
t = 1.0
while t < total - 3:
    degree = int(np.clip(degree + rng.choice([-2, -1, 1, 2]), 0, 12))
    octave, step = divmod(degree, 5)
    midi = 50 + 12 * octave + scale[step]  # D3 から
    midi += 12  # D4 〜 D5 付近へ
    dur = 2.8
    add(bgm, pluck(midi_hz(midi), dur), t, rng.uniform(0.25, 0.5), pan=rng.uniform(0.3, 0.7))
    t += rng.uniform(1.3, 2.7)

tt = 2.0
while tt < total - 3:
    add(bgm, taiko(1.0), tt, 0.1)
    tt += 4.0

# 残響
ir_len = int(2.4 * SR)
decay = np.exp(-np.arange(ir_len) / SR * 2.6)
wet = np.stack([fftconvolve(bgm[c], rng.normal(0, 1, ir_len) * decay)[:n] for c in range(2)])
wet /= np.abs(wet).max() + 1e-9
dry = bgm / (np.abs(bgm).max() + 1e-9)
mix = 0.75 * dry + 0.35 * wet
mix *= np.minimum(1, t_all / 1.5) * np.minimum(1, (total - t_all) / 2.5)
mix = mix / np.abs(mix).max() * 0.5
wavfile.write(out_dir / "bgm.wav", SR, (mix.T * 32767).astype(np.int16))

# ---- 効果音 ----
hit = taiko(1.4)
hit = hit / np.abs(hit).max() * 0.8
wavfile.write(out_dir / "sfx-hit.wav", SR, (hit * 32767).astype(np.int16))

tt_ = np.arange(int(0.35 * SR)) / SR
stamp = (np.sin(2 * np.pi * 330 * tt_) * np.exp(-tt_ * 22) + rng.normal(0, 1, len(tt_)) * np.exp(-tt_ * 90) * 0.4)
stamp = stamp / np.abs(stamp).max() * 0.6
wavfile.write(out_dir / "sfx-stamp.wav", SR, (stamp * 32767).astype(np.int16))
print(f"bgm {total:.1f}s, peak {np.abs(mix).max():.2f}")
