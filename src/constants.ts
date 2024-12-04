/** The maximum size of the player's party */
export const PLAYER_PARTY_MAX_SIZE: number = 6;

/** Whether to use seasonal splash messages in general */
export const USE_SEASONAL_SPLASH_MESSAGES: boolean = false;

/** Name of the session ID cookie */
export const SESSION_ID_COOKIE: string = "access_token";

/** Max value for an integer attribute in {@linkcode SystemSaveData} */
export const MAX_INT_ATTR_VALUE = 0x80000000;

/** Prefix for zip file including all player saves. */
export const SAVES_ZIP_PREFIX = "poketernity_";

/** File extension for save files. */
export const SAVE_FILE_EXTENSION = "poketernity.sav";

/** Prefix for local storage keys. */
export const LS_PREFIX = "pkty";

/** Key for the local storage item storing the locale. */
export const LOCALE_LS_KEY = `${LS_PREFIX}/locale`;
