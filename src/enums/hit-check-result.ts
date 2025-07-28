import type { EnumValues } from "#types/utility-types";

/** Descriptor for the outcome of a move being used against a target */
export const HitCheckResult = {
  /** Hit checks haven't been evaluated yet in this pass */
  PENDING: 1,
  /** The move hits the target successfully */
  HIT: 2,
  /** The move has no effect on the target */
  NO_EFFECT: 3,
  /** The move has no effect on the target, but doesn't proc the default "no effect" message. */
  NO_EFFECT_NO_MESSAGE: 4,
  /** The target protected itself against the move */
  PROTECTED: 5,
  /** The move missed the target */
  MISS: 6,
  /** The move failed unexpectedly */
  ERROR: 7,
} as const;

export type HitCheckResult = EnumValues<typeof HitCheckResult>;
