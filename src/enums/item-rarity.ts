/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { ModifierTier } from "#enums/modifier-tier";
import type { Item } from "#types/item";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { EnumValues } from "#types/utility-types";

/**
 * Defines the rarity of an {@linkcode Item}
 *
 * **Note**: Copied from {@linkcode ModifierTier}.
 */
export const ItemRarity = {
  COMMON: 1,
  GREAT: 2,
  ULTRA: 3,
  EPIC: 4,
  MASTER: 5,
  LUXURY: 6,
} as const;

export type ItemRarity = EnumValues<typeof ItemRarity>;
