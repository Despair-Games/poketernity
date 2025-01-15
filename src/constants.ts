/** Abbreviated name of the application/game. */
export const APP_ABBREVIATION: string = import.meta.env.VITE_APP_ABBREVIATION ?? "game";

/** The maximum size of the player's party */
export const PLAYER_PARTY_MAX_SIZE: number = 6;

/** Whether to use seasonal splash messages in general */
export const USE_SEASONAL_SPLASH_MESSAGES: boolean = false;

/** Name of the session ID cookie */
export const SESSION_ID_COOKIE: string = `${APP_ABBREVIATION}_access_token`;

/** Max value for an integer attribute in {@linkcode SystemSaveData} */
export const MAX_INT_ATTR_VALUE = 0x80000000;

/** Prefix for zip file including all player saves. */
export const SAVES_ZIP_PREFIX = `${APP_ABBREVIATION}_`;

/** File extension for save files. */
export const SAVE_FILE_EXTENSION = `${APP_ABBREVIATION}.txt`;

/** Prefix for local storage keys. */
export const LS_PREFIX = APP_ABBREVIATION;

/** Key for the local storage item storing the locale. */
export const LOCALE_LS_KEY = `${LS_PREFIX}/locale`;

/** Key for the local storage item storing the seen tutorials. */
export const TUTORIALS_LS_KEY = `${LS_PREFIX}/seenTutorials`;

/** Value used for byapssing login values */
export const bypassLogin = import.meta.env.VITE_BYPASS_LOGIN === "1";

/** Key for the local storage item storing the settings. */
export const SETTINGS_LS_KEY = `${LS_PREFIX}/settings`;

/** Key for the local storage item storing the input mapping configs. */
export const MAPPING_CONFIG_LS_KEY = `${LS_PREFIX}/mapping/configs`;

/** The ratio at which PRSFX sound volumes are played is adjusted since they are sigificantly louder. */
export const PRSFX_SOUND_ADJUSTMENT_RATIO = 0.5;

/** The maximum number of language options to display simultaneously. */
export const LANGUAGE_MAX_OPTIONS = 7;

/** All available game speeds. */
export const GAME_SPEEDS = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5];
