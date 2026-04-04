#!/bin/sh -eu

# parts_original.png を 8 倍に拡大した parts.png を生成する。
# ピクセルをくっきりさせたいので補完は使わない。
#
# 使い方:
#
#   $ ./generate.sh
#
# 必要なもの:
#
#   - imagemagick

magick parts_original.png -filter point -resize 800% parts.png
