import { NOTE_NAMES, INTRO_NOTES, MIN_NOTE, NOTE_COUNT, KEY_IS_WHITE } from "./constants";
import { PianoKey } from "./ui";

interface QuizContext {
	scene: g.Scene;
	keys: PianoKey[];
	audioAssets: Record<number, g.AudioAsset>;
	pitchLabel: g.Label;
	scoreLabel: g.Label;
	random: g.RandomGenerator;
	getTime(): number;
	enableWhite: boolean;
	enableBlack: boolean;
	range: "48-72" | "60-71";
}

/**
 * 鍵盤を押す演出（音を鳴らしてラベルを表示し、一定時間後に戻す）
 */
function pressKeyWithSound(ctx: QuizContext, note: number, duration: number): void {
	const noteInOctave = note % 12;
	ctx.keys[noteInOctave].pressDown();
	ctx.pitchLabel.text = NOTE_NAMES[noteInOctave];
	ctx.pitchLabel.invalidate();
	ctx.audioAssets[note].play();

	ctx.scene.setTimeout(() => {
		ctx.keys[noteInOctave].pressUp();
		ctx.pitchLabel.text = "";
		ctx.pitchLabel.invalidate();
	}, duration);
}

/**
 * イントロ演出: ド・ミ・ソを順番に鳴らして相対音感のヒントを与える
 */
export function playIntro(ctx: QuizContext, onComplete: () => void): void {
	INTRO_NOTES.forEach((note, i) => {
		ctx.scene.setTimeout(() => pressKeyWithSound(ctx, note, 200), i * 250);
	});
	ctx.scene.setTimeout(onComplete, 1000);
}

/**
 * ランダムな音のMIDIノート番号に対応する、指定キー位置に最も近いオクターブの音を返す
 */
function findNearestPlayableNote(answerNote: number, keyIndex: number): number {
	const octaveBase = Math.floor(answerNote / 12) * 12;
	let note = octaveBase + keyIndex;
	if (note < MIN_NOTE) note = MIN_NOTE + keyIndex;
	if (note > MIN_NOTE + NOTE_COUNT - 1) note = 60 + keyIndex;
	return note;
}

/**
 * クイズを1問出題する
 */
export function startQuiz(ctx: QuizContext): void {
	const pattern = [...(new Array(NOTE_COUNT))]
		.map((_, i) => (i + MIN_NOTE)) // [48, 49, ..., 72]
		// 有効な鍵盤の音だけを残す
		.filter((i) => ((KEY_IS_WHITE[i % 12] && ctx.enableWhite) || (!KEY_IS_WHITE[i % 12] && ctx.enableBlack)))
		.filter((i) => (ctx.range === "48-72") ? true : (i >= 60 && i <= 71));

	const note = pattern[Math.floor(ctx.random.generate() * pattern.length)] ?? 60;
	let answered = false;
	let player: g.AudioPlayer | null = null;

	// 音を繰り返し再生する
	const playLoop = (): void => {
		if (answered || ctx.getTime() <= 0) return;

		ctx.pitchLabel.text = "?";
		ctx.pitchLabel.invalidate();
		player = ctx.audioAssets[note].play();

		ctx.scene.setTimeout(() => {
			if (answered || ctx.getTime() <= 0) return;
			ctx.pitchLabel.text = "";
			ctx.pitchLabel.invalidate();
		}, 250);
		ctx.scene.setTimeout(playLoop, 500);
	};
	playLoop();

	// 各鍵盤に回答ハンドラを設定
	ctx.keys.forEach((key) => {
		key.setOnDown((keyIndex) => {
			player?.stop();
			if (answered || ctx.getTime() <= 0) return;
			answered = true;
			if (keyIndex === note % 12) {
				// 正解
				g.game.vars.gameState.score += 1;
				ctx.pitchLabel.text = "o";
				ctx.pitchLabel.invalidate();
				ctx.scoreLabel.text = "s" + g.game.vars.gameState.score;
				ctx.scoreLabel.invalidate();
				key.setText("o");
				ctx.scene.setTimeout(() => {
					key.setText("");
					startQuiz(ctx);
				}, 200);
			} else {
				// 不正解
				ctx.pitchLabel.text = "x";
				ctx.pitchLabel.invalidate();
				ctx.audioAssets[findNearestPlayableNote(note, keyIndex)].play();
				key.setText("x");
				ctx.keys[note % 12].setText("o");
				ctx.scene.setTimeout(() => {
					key.setText("");
					ctx.keys[note % 12].setText("");
					startQuiz(ctx);
				}, 1000);
			}
		});
	});
}
