import type { ObjectValues } from "#types/utility-types";

export const MultiHitType = {
  _2: 1,
  _2_TO_5: 2,
  _3: 3,
  _10: 4,
  BEAT_UP: 5,
} as const;

export type MultiHitType = ObjectValues<typeof MultiHitType>;
