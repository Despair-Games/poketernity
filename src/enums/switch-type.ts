/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { SwitchPhase } from "#phases/switch-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { ObjectValues } from "#types/utility-types";

/** Indicates the type of switch functionality that a {@linkcode SwitchPhase} will carry out. */
export const SwitchType = {
  /** Switchout specifically for when combat starts and the player is prompted if they will switch Pokemon */
  INITIAL_SWITCH: 1,
  /** Basic switchout where the Pokemon to switch in is selected */
  SWITCH: 2,
  /** Forced switchout to apply when an active Pokemon faints */
  FAINT_SWITCH: 3,
  /** Transfers stat stages and other effects from the returning Pokemon to the switched in Pokemon */
  BATON_PASS: 4,
  /** Transfers the returning Pokemon's Substitute to the switched in Pokemon */
  SHED_TAIL: 5,
  /** Recalls a Pokemon and switches in a random party member */
  FORCE_SWITCH: 6,
  /** Switchout that allows Wild Pokemon to flee themselves from battle */
  TELEPORT: 7,
} as const;

export type SwitchType = ObjectValues<typeof SwitchType>;
