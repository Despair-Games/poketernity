// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SwitchPhase } from "#phases/switch-phase";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

/** Indicates the type of switch functionality that a {@linkcode SwitchPhase} will carry out. */
export enum SwitchType {
  /** Switchout specifically for when combat starts and the player is prompted if they will switch Pokemon */
  INITIAL_SWITCH,
  /** Basic switchout where the Pokemon to switch in is selected */
  SWITCH,
  /** Transfers stat stages and other effects from the returning Pokemon to the switched in Pokemon */
  BATON_PASS,
  /** Transfers the returning Pokemon's Substitute to the switched in Pokemon */
  SHED_TAIL,
  /** Recalls a Pokemon and switches in a random party member */
  FORCE_SWITCH,
}
