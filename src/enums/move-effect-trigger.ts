import type { ObjectValues } from "#types/utility-types";

export const MoveEffectTrigger = {
  PRE_APPLY: 1,
  POST_APPLY: 2,
  /** Triggers one time after all target effects have applied */
  POST_TARGET: 3,
} as const;

export type MoveEffectTrigger = ObjectValues<typeof MoveEffectTrigger>;
