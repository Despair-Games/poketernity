import type { NumberHolder } from "#app/utils";
import type { TextStyle } from "#app/ui/text";

/**
 * Customizations options for UI's {@linkcode Mode.OPTION_SELECT}
 */
export interface OptionSelectModeConfig extends OptionMenuSettings {
  /** The {@linkcode OptionSelectItem}s to display. */
  options: OptionSelectItem[];
}

/**
 * General settings for how a menu should behave
 */
export interface OptionMenuSettings {
  /** The maximum number of options shown at once on screen. */
  maxOptions?: number;
  /** Horizontal offset for the window compared to the default (right of screen) */
  xOffset?: number | NumberHolder;
  /** Vertical offset for the window compared to the default (bottom of screen) */
  yOffset?: number | NumberHolder;
  /**
   * Set to `true` to prevent closing the menu with the cancel button.
   * Otherwise using the cancel button will act as if the last option was selected.
   */
  noCancel?: boolean;
  /** Optional delay (in ms) before the player is allowed to make a selection. */
  inputDelay?: number;
  /** Set to `true` to allow bypassing the inputDelay with the cancel button. */
  canCancelDelay?: boolean;
}

/**
 * Configuration for an option in the menu
 */
export interface OptionSelectItem {
  /**
   * Text that will be shown in the menu for this option.
   * Can only be on a single line, can use BBCode.
   */
  label: string;
  /**
   * Handler called when that option is selected.
   * @returns `true` to play the "success" sfx, `false` for the "error" sfx
   */
  handler: () => boolean;
  /** Optional handler for when the cursor is moved to that option. */
  onHover?: () => void;
  /** Set to `true` to keep the menu open after this option was selected. */
  keepOpen?: boolean;
  /** Set to `true` to prevent the default menu sound effects from playing. */
  overrideSound?: boolean;
  /**
   * Optional configuration to display icon(s) before the label's text.
   * If multiple icons are given they will be overlayed.
   */
  iconsConfig?: OptionSelectIconConfig[];
  /** Optional {@linkcode TextStyle} to give the item a custom color */
  color?: TextStyle;
}

/**
 * Configuration for displaying a sprite before or after an option's label
 *
 * @example for the friendship candy sprite: `{ name: "items", frame: "candy" }`
 */
export interface OptionSelectIconConfig {
  /** The name of the sprite/texture to use */
  name: string;
  /** The frame to use if the sprite has multiple ones */
  frame?: number | string;
  /** Optional scaling for the icon */
  scale?: number;
  /** Optional tint to give the icon */
  tint?: number;
}
