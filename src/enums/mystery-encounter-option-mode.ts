import type { ObjectValues } from "#types/utility-types";

export const MysteryEncounterOptionMode = {
  /** Default style */
  DEFAULT: 1,
  /** Disabled on requirements not met, default style on requirements met */
  DISABLED_OR_DEFAULT: 2,
  /** Default style on requirements not met, special style on requirements met */
  DEFAULT_OR_SPECIAL: 3,
  /** Disabled on requirements not met, special style on requirements met */
  DISABLED_OR_SPECIAL: 4,
} as const;

export type MysteryEncounterOptionMode = ObjectValues<typeof MysteryEncounterOptionMode>;
