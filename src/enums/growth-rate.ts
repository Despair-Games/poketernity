import type { ObjectValues } from "#types/utility-types";

export const GrowthRate = {
  ERRATIC: 1,
  FAST: 2,
  MEDIUM_FAST: 3,
  MEDIUM_SLOW: 4,
  SLOW: 5,
  FLUCTUATING: 6,
} as const;

export type GrowthRate = ObjectValues<typeof GrowthRate>;
