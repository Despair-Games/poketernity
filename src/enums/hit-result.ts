import type { ObjectValues } from "#types/utility-types";

export const HitResult = {
  EFFECTIVE: 1,
  SUPER_EFFECTIVE: 2,
  NOT_VERY_EFFECTIVE: 3,
  ONE_HIT_KO: 4,
  NO_EFFECT: 5,
  STATUS: 6,
  HEAL: 7,
  FAIL: 8,
  MISS: 9,
  OTHER: 10,
  IMMUNE: 11,
  SELF_KO: 12,
} as const;

export type HitResult = ObjectValues<typeof HitResult>;
