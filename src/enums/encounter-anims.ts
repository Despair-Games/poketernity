import type { AnimConfig } from "#app/data/anim-config";

/**
 * Animations used for Mystery Encounters
 * These are custom animations that may or may not work in any other circumstance
 * Use at your own risk
 */
export enum EncounterAnim {
  MAGMA_BG,
  MAGMA_SPOUT,
  SMOKESCREEN,
  DANCE,
}
export const encounterAnims = new Map<EncounterAnim, AnimConfig>();
