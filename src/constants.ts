/** MIDI ノート番号の範囲 */
export const MIN_NOTE = 48; // C3
export const MAX_NOTE = 72; // C5
export const NOTE_COUNT = MAX_NOTE - MIN_NOTE + 1;

/** 1オクターブの音名 */
export const NOTE_NAMES = "0123456789ab" as const;

/** イントロで鳴らす音（ド・ミ・ソ） */
export const INTRO_NOTES = [60, 64, 67] as const;

/** 鍵盤の白黒判定 */
export const KEY_IS_WHITE = [true, false, true, false, true, true, false, true, false, true, false, true] as const;

/** 鍵盤の X 位置と幅 */
export const KEY_X_POSITIONS = [134, 235-8, 279, 379-8, 423, 568, 669-8, 712, 813-8, 857, 957-8, 1001] as const;
export const KEY_Y_POSITION = 315;
export const KEY_WHITE_SIZE = { width: 145, height: 331 };
export const KEY_BLACK_SIZE = { width: 104, height: 216 };

/** 鍵盤の色 */
export const KEY_COLORS = {
	white: { up: "#0000", down: "#f005" },
	black: { up: "#0000", down: "#f778" },
} as const;

/** ゲームのデフォルト制限時間（秒） */
export const DEFAULT_TIME_LIMIT = 60;
