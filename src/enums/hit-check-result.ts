/** Descriptor for the outcome of a move being used against a target */
export enum HitCheckResult {
  /** Hit checks haven't been evaluated yet in this pass */
  PENDING,
  /** The move hits the target successfully */
  HIT,
  /** The move has no effect on the target */
  NO_EFFECT,
  /** The move has no effect on the target, but doesn't proc the default "no effect" message. */
  NO_EFFECT_NO_MESSAGE,
  /** The target protected itself against the move */
  PROTECTED,
  /** The move missed the target */
  MISS,
  /** The move failed unexpectedly */
  ERROR,
}
