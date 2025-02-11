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
export const SAVE_FILE_EXTENSION = `txt`;

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

/** Min - Max waves for mystery encounter in classic mode. */
export const CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES: [min: number, max: number] = [10, 180];

/** Min - Max waves for mystery encounter in challenge mode. */
export const CHALLENGE_MODE_MYSTERY_ENCOUNTER_WAVES: [min: number, max: number] = [10, 180];

/**
 * Spawn chance: ({@linkcode ME_BASE_SPAWN_WEIGHT} + {@linkcode ME_WEIGHT_INCREMENT_ON_SPAWN_MISS} * <number of missed spawns>) / {@linkcode ME_MAX_SPAWN_WEIGHT}
 */
export const ME_BASE_SPAWN_WEIGHT = 3;

/**
 * The divisor for determining ME spawns, defines the "maximum" weight required for a spawn
 * If spawn_weight === {@linkcode ME_MAX_SPAWN_WEIGHT}, 100% chance to spawn a ME
 */
export const ME_MAX_SPAWN_WEIGHT = 256;

/**
 * When an ME spawn roll fails, {@linkcode ME_WEIGHT_INCREMENT_ON_SPAWN_MISS} is added to future rolls for ME spawn checks.
 * These values are cleared whenever the next ME spawns, and spawn weight returns to {@linkcode ME_BASE_SPAWN_WEIGHT}
 */
export const ME_WEIGHT_INCREMENT_ON_SPAWN_MISS = 3;

/**
 * Specifies the target average for total ME spawns in a single Classic run.
 * Used by anti-variance mechanic to check whether a run is above or below the target on a given wave.
 */
export const ME_AVERAGE_ENCOUNTERS_PER_RUN_TARGET = 12;

/**
 * Will increase/decrease the chance of spawning a ME based on the current run's total MEs encountered vs {@linkcode ME_AVERAGE_ENCOUNTERS_PER_RUN_TARGET}
 * @example:
 * Average-Encounters-Per-Run = 17 (expects avg 1 ME every 10 floors)
 * Anti-Variance-Weight = 15
 *
 * On wave 20, if 1 ME has been encountered, the difference from expected average is 0 MEs.
 * So anti-variance adds 0/256 to the spawn weight check for ME spawn.
 *
 * On wave 20, if 0 MEs have been encountered, the difference from expected average is 1 ME.
 * So anti-variance adds 15/256 to the spawn weight check for ME spawn.
 *
 * On wave 20, if 2 MEs have been encountered, the difference from expected average is -1 ME.
 * So anti-variance adds -15/256 to the spawn weight check for ME spawn.
 */
export const ME_ANTI_VARIANCE_WEIGHT_MODIFIER = 15;

export const PARTY_UI_NO_EFFECT_MSG_i18N_KEY = "partyUiHandler:anyEffect";

/**
 * IVs are between 0 and 31 since in the mainline games it is stored as 5 bits.
 * Each point of IV is worth level/100 extra stat points before the nature multiplier
 */
export const IV_MIN = 0;

export const IV_MAX = 31;
