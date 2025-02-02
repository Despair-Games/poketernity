/** Width of the game in pixels. */
export const GAME_WIDTH = 320;

/** Height of the game in pixels. */
export const GAME_HEIGHT = 180;

/**
 * Scale by which the `GAME_WIDTH` and `GAME_HEIGHT` get multiplied to create the game canvas
 * Everything in the game is multiplied by this scale, to allow us to have text at a higher resolution
 * than the desired pixel size of the game defined by `GAME_WIDTH` and `GAME_HEIGHT`
 * Most parts of the code should *not* worry about this, and UI elements are to be placed based on
 * `GAME_WIDTH` and `GAME_HEIGHT`, as the scaling is handled automatically.
 * As such, when getting an object's dimensions `displayWidth` and `displayHeight` should be used
 * rather than `width` and `height`
 */
export const CANVAS_SCALE = 6;

/** Temporary value to use for adjusting scale of images/sprites to the legacy x6 scale */
export const TEMP_SCALE_ADJUSTEMENT = CANVAS_SCALE / 6;
