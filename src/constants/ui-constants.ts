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
export const TEMP_SCALE_ADJUSTMENT = CANVAS_SCALE / 6;

/**
 * This is used as an internal value to scale text objects so that the end result looks crisp.
 * This value should not be modified unless the fonts and font styles used are modified.
 *
 * With the current font, a font size of 96 with scale of 1/6 makes the text looks crisp.
 * Using a font size of 16 with no scaling makes the text extremely blurry.
 * Using other scale values doesn't work either, except for 8.
 *
 * This scale should be used when setting a text object's wrapping width. For example,
 * for a text object that should be at most 100 pixels wide (not taking in account CANVAS_SCALE),
 * the wrap width should be set to `100 * TEXT_SCALE`.
 */
export const TEXT_SCALE = 6;
