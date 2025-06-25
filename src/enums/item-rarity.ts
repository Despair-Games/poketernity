// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { ModifierTier } from "#enums/modifier-tier";
import type { Item } from "#types/item";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
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
