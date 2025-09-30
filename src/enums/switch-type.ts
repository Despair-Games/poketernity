/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { SwitchPhase } from "#phases/switch-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

/** Indicates the type of switch functionality that a {@linkcode SwitchPhase} will carry out. */
export enum SwitchType {
  /** Switchout specifically for when combat starts and the player is prompted if they will switch Pokemon */
  INITIAL_SWITCH,
  /** Basic switchout where the Pokemon to switch in is selected */
  SWITCH,
  /** Forced switchout to apply when an active Pokemon faints */
  FAINT_SWITCH,
  /** Transfers stat stages and other effects from the returning Pokemon to the switched in Pokemon */
  BATON_PASS,
  /** Transfers the returning Pokemon's Substitute to the switched in Pokemon */
  SHED_TAIL,
  /** Recalls a Pokemon and switches in a random party member */
  FORCE_SWITCH,
  /** Switchout that allows Wild Pokemon to flee themselves from battle */
  TELEPORT,
}
