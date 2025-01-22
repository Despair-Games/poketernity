// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Mode } from "#app/ui/ui";
// -- end tsdoc imports --
import type { TextStyle } from "#app/ui/text";

/**
 * Customizations options for UI's {@linkcode Mode.OPTION_SELECT}
 *
 * @template T the specifc type of {@linkcode OptionSelectItem} contained by this config
 */
export interface OptionSelectModeConfig<T extends OptionSelectItem = OptionSelectItem> extends OptionMenuSettings {
  /** The {@linkcode OptionSelectItem}s to display. */
  options: T[];
}

/**
 * General settings for how a menu should behave
 */
export interface OptionMenuSettings {
  /** The maximum number of options shown at once on screen. */
  readonly maxOptions?: number;
  /** Horizontal offset for the window compared to the default (right of screen) */
  readonly xOffset?: number;
  /** Vertical offset for the window compared to the default (bottom of screen) */
  readonly yOffset?: number;
  /** Set to `true` to prevent using the cancel button as a shorcut to selecting the last option in the menu. */
  readonly blockCancelButton?: boolean;
  /** Optional delay (in ms) before the player is allowed to make a selection. */
  readonly inputDelay?: number;
  /** Set to `true` to allow bypassing the inputDelay with the cancel button. */
  readonly canBypassInputDelay?: boolean;
  /** Optional callback for when the window gets resized. */
  readonly onResize?: (w: number, h: number) => void;
}

/**
 * Configuration for an option in the menu
 */
export interface OptionSelectItem {
  /**
   * Text that will be shown in the menu for this option.
   * Can only be on a single line, can use BBCode.
   */
  readonly label: string;
  /**
   * Handler called when that option is selected.
   * @returns `true` to play the "success" sfx, `false` for the "error" sfx
   */
  handler: () => boolean;
  /** Optional handler for when the cursor is moved to that option. */
  readonly onHover?: () => void;
  /** Set to `true` to keep the menu open after this option was selected. */
  readonly keepOpen?: boolean;
  /** Set to `true` to prevent the default menu sound effects from playing. */
  readonly noSoundEffects?: boolean;
  /**
   * Optional configuration to display icon(s) before the label's text.
   * If multiple icons are given they will be overlayed.
   */
  readonly iconsConfig?: OptionSelectIconConfig[];
  /** Optional {@linkcode TextStyle} to give the item a custom color */
  readonly color?: TextStyle;
}

/**
 * Configuration for displaying a sprite before an option's label
 *
 * @example for the friendship candy sprite: `{ name: "items", frame: "candy" }`
 */
export interface OptionSelectIconConfig {
  /** The name of the sprite/texture to use */
  readonly name: string;
  /** The frame to use if the sprite has multiple ones */
  readonly frame?: number | string;
  /** Optional scaling for the icon */
  readonly scale?: number;
  /** Optional tint to give the icon */
  readonly tint?: number;
}
