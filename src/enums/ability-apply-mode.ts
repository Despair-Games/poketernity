import type { ObjectValues } from "#types/utility-types";

export const AbilityApplyMode = {
  /** Applies abilities as normal, without restrictions */
  DEFAULT: 1,
  /** Only applies abilities that were previously applied in the current battle */
  REVEALED: 2,
  /** Prevents abilities from applying altogether */
  IGNORE: 3,
} as const;

export type AbilityApplyMode = ObjectValues<typeof AbilityApplyMode>;
