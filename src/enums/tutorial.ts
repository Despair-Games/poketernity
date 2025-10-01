import type { EnumValues } from "#types/utility-types";

export const Tutorial = {
  INTRO: 1,
  ACCESS_MENU: 2,
  MENU: 3,
  STARTER_SELECT: 4,
  POKERUS: 5,
  STAT_CHANGE: 6,
  SELECT_ITEM: 7,
  EGG_GACHA: 8,
} as const;

export type Tutorial = EnumValues<typeof Tutorial>;
