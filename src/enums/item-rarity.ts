// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ModifierTier } from "#enums/modifier-tier";
import { type Item } from "#app/@types/Item";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

/**
 * Defines the rarity of an {@linkcode Item}
 *
 * **Note**: Copied from {@linkcode ModifierTier}.
 */
export enum ItemRarity {
  COMMON,
  GREAT,
  ULTRA,
  EPIC,
  MASTER,
  LUXURY,
}
