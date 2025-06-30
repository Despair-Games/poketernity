import type { EnumValues } from "#types/enum-values";

export const BattleType = {
  WILD: 1,
  TRAINER: 2,
  CLEAR: 3,
  MYSTERY_ENCOUNTER: 4,
} as const;

export type BattleType = EnumValues<typeof BattleType>;
