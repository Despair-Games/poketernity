import type { EnumValues } from "#types/utility-types";

// TODO: start at 1
export const PokeballType = {
  POKEBALL: 0,
  GREAT_BALL: 1,
  ULTRA_BALL: 2,
  MASTER_BALL: 3,
  /**
   * Temporarily used to represent epic tier items in the shop, not available to the player. \
   * For that, it needs to be placed after the Master ball.
   */
  LUXURY_BALL: 4,
} as const;

export type PokeballType = EnumValues<typeof PokeballType>;
