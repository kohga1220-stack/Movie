"""関ヶ原周辺の実際の地形（標高データ）から、3D 描画用のデータを作る。

データ: AWS Open Data「Terrain Tiles」（terrarium 形式、z=12）。出典の表記が必要（docs/credits.md）。
出力:
  public/terrain/height.bin   標高（Int16・デシメートル）。N×N の格子
  public/terrain/color.png    陰影起伏＋標高の彩色＋等高線（テクスチャ）
  public/terrain/meta.json    範囲・大きさ・格子数・ランドマークの位置

使い方:  python tools/gen_terrain.py        （numpy・Pillow が必要）
"""
import io
import json
import math
import pathlib
import urllib.request

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "terrain"
OUT.mkdir(parents=True, exist_ok=True)
Z = 12
TX, TY = 3599, 1616  # 左上のタイル。3x3 枚（約 24km 四方）。関ヶ原は中央のタイル（3600, 1617）
GRID = 384  # 3D メッシュの格子数

SEKIGAHARA = (136.466944, 35.365556)  # 関ケ原町（Wikipedia）
NANGUSAN = (136.509795, 35.346828)  # 南宮山 標高419m（Wikipedia）
MATSUOYAMA = (136.453611, 35.346667)  # 松尾山 標高292.9m（Wikipedia：北緯35°20′48″ 東経136°27′13″）


def tile(x, y):
    url = f"https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{Z}/{x}/{y}.png"
    with urllib.request.urlopen(url, timeout=60) as r:
        im = Image.open(io.BytesIO(r.read())).convert("RGB")
    a = np.asarray(im, dtype=np.float64)
    return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768


rows = [np.concatenate([tile(TX + i, TY + j) for i in range(3)], axis=1) for j in range(3)]
elev_raw = np.concatenate(rows, axis=0)  # 768 x 768 [m]
N = elev_raw.shape[0]
elev = gaussian_filter(elev_raw, 1.3)  # 標高データの 1m 刻みの階段を平滑化


def lonlat_to_px(lon, lat):
    n = 2**Z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return (x - TX) * 256, (y - TY) * 256


def px_to_lonlat(px, py):
    n = 2**Z
    lon = (px / 256 + TX) / n * 360 - 180
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (py / 256 + TY) / n))))
    return lon, lat


# 1 ピクセルの実距離（m）
lat0 = SEKIGAHARA[1]
mpp = 40075016.686 * math.cos(math.radians(lat0)) / (256 * 2**Z)

# 位置の検証：Wikipedia の座標の周辺（±300m）で標高の最大点を探し、記載の標高と比べる
def peak_near(lonlat, r=10):
    x, y = lonlat_to_px(*lonlat)
    sub = elev_raw[int(y) - r : int(y) + r + 1, int(x) - r : int(x) + r + 1]  # 検証は、平滑化前の生データで行う
    iy, ix = np.unravel_index(np.argmax(sub), sub.shape)
    return (int(x) - r + ix, int(y) - r + iy), float(sub[iy, ix])


matsuo_px, matsuo_elev = peak_near(MATSUOYAMA)
nangu_px, nangu_elev = peak_near(NANGUSAN)
px, py = lonlat_to_px(*SEKIGAHARA)
print(f"松尾山 周辺の最大標高 {matsuo_elev:.0f} m（Wikipedia: 292.9 m）／南宮山 {nangu_elev:.0f} m（Wikipedia: 419 m）／関ヶ原 {elev[int(py), int(px)]:.0f} m")

# ---- 高さの格子（Int16・デシメートル）----
from PIL import Image as _I
grid = np.asarray(_I.fromarray(elev.astype(np.float32), mode="F").resize((GRID, GRID), _I.BICUBIC), dtype=np.float64)
(OUT / "height.bin").write_bytes(np.round(grid * 10).astype("<i2").tobytes())

# ---- 色のテクスチャ（陰影起伏＋彩色。等高線は描かない）----
TEX = 2048
e = np.asarray(_I.fromarray(elev.astype(np.float32), mode="F").resize((TEX, TEX), _I.BICUBIC), dtype=np.float64)
cell = mpp * N / TEX
gy, gx = np.gradient(e, cell)
slope = np.arctan(np.hypot(gx, gy))
aspect = np.arctan2(-gx, gy)
az, alt = math.radians(315), math.radians(40)
hs = np.clip(np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect), 0, 1)

# 擬似的な細かい模様（固定シード）：田畑・森の濃淡のむら
rng = np.random.default_rng(11)
def noise(scale, amp):
    n = rng.normal(0, 1, (TEX // scale + 2, TEX // scale + 2))
    n = np.asarray(_I.fromarray(n.astype(np.float32), mode="F").resize((TEX, TEX), _I.BICUBIC), dtype=np.float64)
    return n * amp
tex_noise = noise(64, 0.05) + noise(16, 0.04) + noise(4, 0.025)

flat = np.clip(1 - slope / 0.12, 0, 1)  # 平地（田畑・集落）
low = np.clip(1 - (e - 120) / 140, 0, 1)  # 低地
field = flat * low
golden = np.array([0.80, 0.70, 0.43])  # 秋の田
green = np.array([0.55, 0.62, 0.36])
forest_lo = np.array([0.24, 0.35, 0.22])
forest_hi = np.array([0.17, 0.26, 0.20])
rock = np.array([0.55, 0.55, 0.48])
tf = np.clip((e - 150) / 500, 0, 1)[..., None]
forest = forest_lo + (forest_hi - forest_lo) * tf
fieldcol = golden * (0.5 + 0.5 * (tex_noise[..., None] > 0)) + green * (0.5 - 0.5 * (tex_noise[..., None] > 0))
col = forest * (1 - field[..., None]) + fieldcol * field[..., None]
hi_rock = np.clip((e - 800) / 400, 0, 1)[..., None]
col = col * (1 - hi_rock) + rock * hi_rock
shade = 0.80 + 0.36 * (hs - 0.5)
img = np.clip(col * shade[..., None] * (1 + tex_noise[..., None]), 0, 1)
Image.fromarray((img * 255).astype(np.uint8)).save(OUT / "color.png", optimize=True)

# ---- メタ情報 ----
size_m = mpp * N
lo = px_to_lonlat(0, 0)
hi = px_to_lonlat(N, N)


def world(lon, lat):
    """関ヶ原を原点にした、東向き x[m]・南向き z[m]。"""
    p = lonlat_to_px(lon, lat)
    return [(p[0] - px) * mpp, (p[1] - py) * mpp]


meta = {
    "grid": GRID,
    "sizeMeters": size_m,
    "originPx": [px / N, py / N],  # 範囲内での関ヶ原の位置（0〜1）
    "bboxLonLat": [lo[0], hi[1], hi[0], lo[1]],
    "elevMin": float(grid.min()),
    "elevMax": float(grid.max()),
    "elevAtPin": float(elev[int(py), int(px)]),
    "landmarks": {
        "sekigahara": world(*SEKIGAHARA),
        "nangusan": world(*px_to_lonlat(*nangu_px)),
        "matsuoyama": world(*px_to_lonlat(*matsuo_px)),
    },
    "check": {"matsuoElev": matsuo_elev, "nanguElev": nangu_elev},
}
(OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(meta, ensure_ascii=False)[:600])
