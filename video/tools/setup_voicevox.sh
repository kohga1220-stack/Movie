#!/usr/bin/env bash
# VOICEVOX（音声合成）の実行に必要なファイルを、公式のリリースから取得する。
# 取得先は GitHub のリリース資産のみ（公式ダウンローダーは api.github.com を使うため、使わない）。
#
# 利用前に、次の利用規約を確認すること（このスクリプトは、規約への同意を代行しない）:
#   - VOICEVOX 音声モデル利用規約と、各音声ライブラリの規約:
#       https://github.com/VOICEVOX/voicevox_vvm （README の「利用規約」）
#   - 青山龍星: 個人は「VOICEVOX:青山龍星」のクレジットで商用・非商用とも可。
#               企業が携わる形では、事前確認が必要（https://v.seventhh.com/contact/）。
#
# 使い方:  bash tools/setup_voicevox.sh [VVM番号]    （既定は 15 ＝ 青山龍星・玄野武宏以外の話者は tools/gen_narration.py 参照）
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=.voicevox
CORE=0.16.4
ORT=1.17.3
VVM=${1:-15}
mkdir -p "$OUT/vvm"
dl() { [ -s "$2" ] || curl -fL --retry 3 -o "$2" "$1"; }
dl "https://github.com/VOICEVOX/voicevox_core/releases/download/$CORE/voicevox_core-$CORE-cp310-abi3-manylinux_2_34_x86_64.whl" "$OUT/voicevox_core-$CORE-cp310-abi3-manylinux_2_34_x86_64.whl"
dl "https://github.com/VOICEVOX/onnxruntime-builder/releases/download/voicevox_onnxruntime-$ORT/voicevox_onnxruntime-linux-x64-$ORT.tgz" "$OUT/ort.tgz"
[ -d "$OUT/voicevox_onnxruntime-linux-x64-$ORT" ] || tar xzf "$OUT/ort.tgz" -C "$OUT"
dl "https://github.com/VOICEVOX/voicevox_vvm/releases/download/$CORE/$VVM.vvm" "$OUT/vvm/$VVM.vvm"
echo "完了。次に: pip install $OUT/voicevox_core-$CORE-cp310-abi3-manylinux_2_34_x86_64.whl"
