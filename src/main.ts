import { GameMainParameterObject } from "./parameterObject";
import { MIN_NOTE, NOTE_COUNT, DEFAULT_TIME_LIMIT } from "./constants";
import { createUI } from "./ui";
import { playIntro, startQuiz } from "./quiz";

export function main(param: GameMainParameterObject): void {
	const assetIds = [...(new Array(NOTE_COUNT))].map((_, i) => {
		const note = i + MIN_NOTE;
		return { note, id: `key${note}` };
	});

	const scene = new g.Scene({
		game: g.game,
		assetIds: ["background", "parts", ...assetIds.map((a) => a.id)],
	});

	let time = param.sessionParameter.totalTimeLimit ?? DEFAULT_TIME_LIMIT;

	g.game.vars.gameState = { score: 0 };

	scene.onLoad.add(() => {
		// 背景
		scene.append(new g.Sprite({ scene, src: scene.asset.getImageById("background"), width: 1280, height: 720 }));

		// オーディオアセットの取得
		const audioAssets = assetIds.reduce<Record<number, g.AudioAsset>>((acc, { note, id }) => {
			acc[note] = scene.asset.getAudioById(id);
			return acc;
		}, {});

		const ui = createUI(scene);

		const quizContext = {
			scene,
			keys: ui.keys,
			audioAssets,
			pitchLabel: ui.pitchLabel,
			scoreLabel: ui.scoreLabel,
			random: param.random,
			getTime: () => time,
		};

		// タップでゲーム開始
		scene.onPointDownCapture.addOnce(() => {
			ui.intro.destroy();
			playIntro(quizContext, () => startQuiz(quizContext));
		});

		// カウントダウン
		const updateHandler = (): void => {
			if (time <= 0) {
				scene.onUpdate.remove(updateHandler);
				return;
			}
			time -= 1 / g.game.fps;
			ui.timeLabel.text = "t" + Math.ceil(time);
			ui.timeLabel.invalidate();
		};
		scene.onUpdate.add(updateHandler);
	});

	g.game.pushScene(scene);
}
