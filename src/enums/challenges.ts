import type { EnumValues } from "#types/enum-values";

export const Challenges = {
  SINGLE_GENERATION: 1,
  SINGLE_TYPE: 2,
  LOWER_MAX_STARTER_COST: 3,
  LOWER_STARTER_POINTS: 4,
  FRESH_START: 5,
  INVERSE_BATTLE: 6,
} as const;

export type Challenges = EnumValues<typeof Challenges>;
