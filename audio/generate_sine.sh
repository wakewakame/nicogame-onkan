#!/bin/sh -eu

# 効果音ファイルを生成する
#
# 使い方:
#
#   $ ./generate_sine.sh
#
# 必要なもの:
#
#   - ffmpeg
#     - brew install ffmpeg-full
#   - complete-audio
#     - npm install -g @akashic/complete-audio

# C3(48) - C5(72) までの音階の音声ファイルを生成する
ffmpeg -y -f lavfi -i '
	aevalsrc=(
		sin(2 * PI * 440 * (2^((floor(48 + t) - 69) / 12)) * t) * (1 - exp(-80 * mod(t\, 1))) * exp(-8 * mod(t\, 1))
	):s=48000:d=25
' -f wav 'piano.wav'

# m4a と ogg に変換
rm -f piano.m4a piano.ogg
complete-audio 'piano.wav'

# 不要なファイルを削除
rm piano.wav
