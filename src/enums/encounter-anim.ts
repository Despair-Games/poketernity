import type { ObjectValues } from "#types/utility-types";

/**
 * Animations used for Mystery Encounters.
 *
 * These are custom animations that may or may not work in any other circumstance, use at your own risk.
 */
export const EncounterAnim = {
  MAGMA_BG: 1,
  MAGMA_SPOUT: 2,
  SMOKESCREEN: 3,
  DANCE: 4,
} as const;

export type EncounterAnim = ObjectValues<typeof EncounterAnim>;
