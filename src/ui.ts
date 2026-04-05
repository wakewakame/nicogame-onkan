import { KEY_IS_WHITE, KEY_X_POSITIONS, KEY_Y_POSITION, KEY_WHITE_SIZE, KEY_BLACK_SIZE, KEY_COLORS } from "./constants";

export interface GameUI {
	intro: g.E;
	timeLabel: g.Label;
	scoreLabel: g.Label;
	pitchLabel: g.Label;
	keys: PianoKey[];
}

export interface PianoKey {
	entity: g.FilledRect;
	isWhite: boolean;
	/** 鍵盤を押した見た目にする */
	pressDown(): void;
	/** 鍵盤を離した見た目にする */
	pressUp(): void;
	/** 鍵盤が押されたときのコールバックを設定する */
	setOnDown(callback: (noteInOctave: number) => void): void;
	/** 鍵盤上のテキストを設定する */
	setText(text: string): void;
}

/**
 * ゲームのUI要素（フォント、各種ラベル）を生成して scene に追加する
 */
export function createUI(scene: g.Scene, enableWhite: boolean, enableBlack: boolean): GameUI {
	const parts = scene.asset.getImageById("parts");

	const scoreFont = new g.BitmapFont({
		src: parts,
		glyphInfo: {
			map: {
				"48" : { x: (1+9*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 0
				"49" : { x: (1+0*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 1
				"50" : { x: (1+1*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 2
				"51" : { x: (1+2*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 3
				"52" : { x: (1+3*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 4
				"53" : { x: (1+4*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 5
				"54" : { x: (1+5*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 6
				"55" : { x: (1+6*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 7
				"56" : { x: (1+7*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 8
				"57" : { x: (1+8*6)*8, y:  1*8, width:  5*8, height: 7*8 }, // 9
				"116": { x: 1      *8, y:  9*8, width: 24*8, height: 7*8 }, // t (time)
				"115": { x: 1      *8, y: 17*8, width: 24*8, height: 7*8 }, // s (score)
				"111": { x: 26     *8, y:  9*8, width:  7*8, height: 7*8 }, // o (○)
				"120": { x: 34     *8, y:  9*8, width:  7*8, height: 7*8 }, // x (×)
			},
			missingGlyph: { x: (1+9*6)*8, y: 1*8, width: 5*8, height: 7*8 },
			width: 5*8, height: 7*8,
		},
	});

	const pitchFont = new g.BitmapFont({
		src: parts,
		glyphInfo: {
			map: {
				// MEMO: 白枠を含めない四角のサイズは 27*8 x 14*8
				"48" : { x: (2+0*28)*8+4, y: (26+0*15)*8+4, width: 26*8, height: 13*8 }, // 0 (ド)
				"49" : { x: (2+1*28)*8+4, y: (26+0*15)*8+4, width: 26*8, height: 13*8 }, // 1 (ド#)
				"50" : { x: (2+2*28)*8+4, y: (26+0*15)*8+4, width: 26*8, height: 13*8 }, // 2 (レ)
				"51" : { x: (2+0*28)*8+4, y: (26+1*15)*8+4, width: 26*8, height: 13*8 }, // 3 (レ#)
				"52" : { x: (2+1*28)*8+4, y: (26+1*15)*8+4, width: 26*8, height: 13*8 }, // 4 (ミ)
				"53" : { x: (2+2*28)*8+4, y: (26+1*15)*8+4, width: 26*8, height: 13*8 }, // 5 (ファ)
				"54" : { x: (2+0*28)*8+4, y: (26+2*15)*8+4, width: 26*8, height: 13*8 }, // 6 (ファ#)
				"55" : { x: (2+1*28)*8+4, y: (26+2*15)*8+4, width: 26*8, height: 13*8 }, // 7 (ソ)
				"56" : { x: (2+2*28)*8+4, y: (26+2*15)*8+4, width: 26*8, height: 13*8 }, // 8 (ソ#)
				"57" : { x: (2+0*28)*8+4, y: (26+3*15)*8+4, width: 26*8, height: 13*8 }, // 9 (ラ)
				"97" : { x: (2+1*28)*8+4, y: (26+3*15)*8+4, width: 26*8, height: 13*8 }, // a (ラ#)
				"98" : { x: (2+2*28)*8+4, y: (26+3*15)*8+4, width: 26*8, height: 13*8 }, // b (シ)
				"63" : { x: (2+0*28)*8+4, y: (26+4*15)*8+4, width: 26*8, height: 13*8 }, // ?
				"111": { x: (2+1*28)*8+4, y: (26+4*15)*8+4, width: 26*8, height: 13*8 }, // o (○)
				"120": { x: (2+2*28)*8+4, y: (26+4*15)*8+4, width: 26*8, height: 13*8 }, // x (×)
			},
			missingGlyph : { x: (2+0*28)*8+4, y: 26*8+4, width: 26*8, height: 13*8 },
			width: 27*8, height: 15*8,
		},
	});

	const timeLabel = new g.Label({ scene, text: "t0", font: scoreFont, fontSize: 7*8, x: 160, y: 80 });
	scene.append(timeLabel);

	const scoreLabel = new g.Label({ scene, text: "s0", font: scoreFont, fontSize: 7*8, x: 160, y: 80+7*8 });
	scene.append(scoreLabel);

	const pitchLabel = new g.Label({ scene, text: "", font: pitchFont, fontSize: 13*8, x: 536, y: 118 });
	scene.append(pitchLabel);

	const keys: PianoKey[] = [...(new Array(12))].map((_, i) => {
		const isWhite = KEY_IS_WHITE[i];
		const size = isWhite ? KEY_WHITE_SIZE : KEY_BLACK_SIZE;
		const colors = isWhite ? KEY_COLORS.white : KEY_COLORS.black;
		const enable = (isWhite && enableWhite) || (!isWhite && enableBlack);
		const entity = new g.FilledRect({
			scene,
			cssColor: colors.up,
			x: KEY_X_POSITIONS[i],
			y: KEY_Y_POSITION,
			width: size.width,
			height: size.height,
			touchable: enable,
		});
		const text = new g.Label({
			scene,
			text: enable ? "" : "x",
			font: scoreFont,
			fontSize: 7*8,
			x: (size.width - 7*8) / 2,
			y: size.height - 80,
			touchable: false,
		});
		entity.append(text);

		let onDown: (noteInOctave: number) => void | undefined = undefined;

		entity.onPointDown.add(() => {
			entity.cssColor = colors.down;
			onDown?.(i);
		});
		entity.onPointUp.add(() => {
			entity.cssColor = colors.up;
		});

		return {
			entity,
			isWhite,
			pressDown() {
				entity.cssColor = colors.down;
			},
			pressUp() {
				entity.cssColor = colors.up;
			},
			setOnDown(callback: (noteInOctave: number) => void) {
				onDown = callback;
			},
			setText(textStr: string) {
				text.text = textStr;
				text.invalidate();
			},
		};
	});
	// 白鍵を先に追加（黒鍵が上に描画されるように）
	keys.filter((k) => k.isWhite).forEach((k) => scene.append(k.entity));
	keys.filter((k) => !k.isWhite).forEach((k) => scene.append(k.entity));

	const intro = new g.FilledRect({ scene, cssColor: "#fff7", x: 0, y: 0, width: scene.game.width, height: scene.game.height });
	const introText = new g.Sprite({
		scene,
		src: parts, srcX: 2*8, srcY: 102*8, srcWidth: 63*8, srcHeight: 35*8,
		x: 388, y: 220, width: 63*8, height: 35*8,
	});
	intro.append(introText);
	scene.append(intro);

	return { intro, timeLabel, scoreLabel, pitchLabel, keys };
}
