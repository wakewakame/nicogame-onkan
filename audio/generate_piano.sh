#!/bin/sh -eu

# 効果音ファイルを生成する
#
# 使い方:
#
#   $ ./generate_piano.sh
#
# 必要なもの:
#
#   - FluidSynth
#	  - brew install fluid-synth
#   - ffmpeg
#     - brew install ffmpeg-full
#   - complete-audio
#     - npm install -g @akashic/complete-audio

# sf2 の解凍
tar xfvJ 'UprightPianoKW-SF2-20220221.tar.xz'

# increment.mid の生成方法
#
# import mido
# midi = mido.MidiFile(ticks_per_beat=480)
# midi.tracks.append(mido.MidiTrack())
# midi.tracks[0].append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(120)))
# for note in range(127):
# 	midi.tracks[0].append(mido.Message('note_on', note=note, velocity=127, time= 0 if note == 0 else 480+480-240))
# 	midi.tracks[0].append(mido.Message('note_off', note=note, time=240))
# midi.save("increment.mid")

# 全鍵盤の音を 0 -> 127 の順で 1 秒ずつ鳴らす音源を生成
fluidsynth -F piano_all.wav -r 48000 -ni './UprightPianoKW-SF2-20220221/UprightPianoKW-20220221.sf2' './increment.mid'

# 必要な範囲だけ切り出す
ffmpeg -y -i piano_all.wav -ss 48 -to 73 -c copy piano.wav

# m4a と ogg に変換
rm -f piano.m4a piano.ogg
complete-audio piano.wav

# 不要なファイルを削除
rm piano_all.wav piano.wav
