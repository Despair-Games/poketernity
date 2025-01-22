// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AbstractOptionSelectUiHandler from "#app/ui/abstract-option-select-ui-handler";
// -- end tsdoc imports --
import type { OptionSelectItem } from "./option-select-config";

/**
 * Used internally by {@linkcode AbstractOptionSelectUiHandler} to keep track
 * of whether a menu item has been processed and is ready to be displayed.
 */
export interface UIOptionSelectItem extends OptionSelectItem {
  initialized: boolean;
  displayLabel: string;
  iconsWidth?: number;
}
