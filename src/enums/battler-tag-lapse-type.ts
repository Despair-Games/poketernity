import type { ObjectValues } from "#types/utility-types";

export const BattlerTagLapseType = {
  FAINT: 1,
  MOVE: 2,
  PRE_MOVE: 3,
  AFTER_MOVE: 4,
  MOVE_EFFECT: 5,
  TURN_END: 6,
  HIT: 7,
  AFTER_HIT: 8,
  CUSTOM: 9,
} as const;

export type BattlerTagLapseType = ObjectValues<typeof BattlerTagLapseType>;
