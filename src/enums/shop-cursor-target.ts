import type { ObjectValues } from "#types/utility-types";

/** Determines the row cursor target when entering the shop phase. */
// The enum values are used as cursor values and thus this cannot start at `1` currently.
export const ShopCursorTarget = {
  /** Cursor points to Reroll row */
  REROLL: 0,
  /** Cursor points to Rewards row */
  REWARDS: 1,
  /** Cursor points to Shop row */
  SHOP: 2,
  /** Cursor points to Check Team row */
  CHECK_TEAM: 3,
} as const;

export type ShopCursorTarget = ObjectValues<typeof ShopCursorTarget>;
