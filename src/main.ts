import { MIN_NOTE, NOTE_COUNT, DEFAULT_TIME_LIMIT } from "./constants";
import { GameMainParameterObject } from "./parameterObject";
import { playIntro, startQuiz } from "./quiz";
import { createUI } from "./ui";

declare const window: any;

export function main(param: GameMainParameterObject): void {
	const mode: {
		tone: "piano" | "sine";
		enableWhite: boolean;
		enableBlack: boolean;
		range: "48-72" | "60-71";
	} = {
		tone: "piano",
		enableWhite: true,
		enableBlack: true,
		range: "48-72",
	};

	// クエリパラメータを得る (ブラウザから起動した時用)
	try {
		const params = new window.URLSearchParams(window.location.search);
		if (params.get("tone") === "sine") {
			mode.tone = "sine";
		}
		if (params.get("tone") === "piano") {
			mode.tone = "piano";
		}
		if (params.get("white") === "true") {
			mode.enableWhite = true;
		}
		if (params.get("white") === "false") {
			mode.enableWhite = false;
		}
		if (params.get("black") === "true") {
			mode.enableBlack = true;
		}
		if (params.get("black") === "false") {
			mode.enableBlack = false;
		}
		if (params.get("range") === "single") {
			mode.range = "60-71";
		}
		if (params.get("range") === "double") {
			mode.range = "48-72";
		}
	} catch { /* ignore */ }

	const assetIds = [...(new Array(NOTE_COUNT))].map((_, i) => {
		const note = i + MIN_NOTE;
		return { note, id: `${mode.tone}${note}` };
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

		const ui = createUI(scene, mode.enableWhite, mode.enableBlack);

		const quizContext = {
			scene,
			keys: ui.keys,
			audioAssets,
			pitchLabel: ui.pitchLabel,
			scoreLabel: ui.scoreLabel,
			random: param.random,
			getTime: () => time,
			enableWhite: mode.enableWhite,
			enableBlack: mode.enableBlack,
			range: mode.range,
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
