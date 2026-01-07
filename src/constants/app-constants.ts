/** Abbreviated name of the application/game. */
export const APP_ABBREVIATION: string = import.meta.env.VITE_APP_ABBREVIATION ?? "game";

/** Whether to use seasonal splash messages in general */
export const USE_SEASONAL_SPLASH_MESSAGES: boolean = false;

/** Value used to bypass the login step in offline mode */
export const BYPASS_LOGIN = import.meta.env.VITE_BYPASS_LOGIN === "1";

/** Name of the session ID cookie */
export const SESSION_ID_COOKIE: string = `${APP_ABBREVIATION}_access_token`;

/** Prefix for zip file including all player saves. */
export const SAVES_ZIP_PREFIX = `${APP_ABBREVIATION}_`;

/** File extension for save files. */
export const SAVE_FILE_EXTENSION = "txt";

/** Prefix for local storage keys. */
const LS_PREFIX = APP_ABBREVIATION;

/** Prefix for the local storage key of system data. */
export const SYSTEM_DATA_LS_KEY_PREFIX = `${LS_PREFIX}/data`;

/** Prefix for the local storage key of session data. */
export const SESSION_DATA_LS_KEY_PREFIX = `${LS_PREFIX}/sessionData`;

/** Prefix for the local storage key of run history data. */
export const RUN_HISTORY_LS_KEY_PREFIX = `${LS_PREFIX}/runHistoryData`;

/** Prefix for the local storage key of starter preferences. */
export const STARTER_PREF_LS_KEY_PREFIX = `${LS_PREFIX}/starterPrefs`;

/** Prefix for the local storage key of touch constrols positionning. */
export const TOUCH_CONSTROLS_LS_KEY_PREFIX = `${LS_PREFIX}/touchControl/positions`;

/** Key for the local storage item storing the last cleared daily seed in offline mode. */
export const DAILY_SEED_LS_KEY = `${LS_PREFIX}/daily`;

/** Key for the local storage item storing the locale. */
export const LOCALE_LS_KEY = `${LS_PREFIX}/locale`;

/** Key for the local storage item storing the seen tutorials. */
export const TUTORIALS_LS_KEY = `${LS_PREFIX}/seenTutorials`;

/** Key for the local storage item storing the seen dialogue. */
export const SEEN_DIALOGUE_LS_KEY = `${LS_PREFIX}/seenDialogues`;

/** Key for the local storage item storing the settings. */
export const SETTINGS_LS_KEY = `${LS_PREFIX}/settings`;

/** Key for the local storage item storing the input mapping configs. */
export const MAPPING_CONFIG_LS_KEY = `${LS_PREFIX}/mapping/configs`;

/** The ratio at which PRSFX sound volumes are played is adjusted since they are significantly louder. */
export const PRSFX_SOUND_ADJUSTMENT_RATIO = 0.5;

/** All available game speeds. */
export const GAME_SPEEDS = Object.freeze([1, 1.25, 1.5, 2, 2.5, 3, 4, 5]);

/** The maximum number of runs stored in the run history. */
export const RUN_HISTORY_LIMIT: number = 25;

/** The number of save slots available to players. */
export const SAVE_SLOT_LIMIT: number = 5;

/** Whether the app is running in beta (or development) mode. */
export const IS_BETA = import.meta.env.MODE === "beta";

/** Whether the app is running in a test environment */
export const IS_TEST = import.meta.env.NODE_ENV === "test";
