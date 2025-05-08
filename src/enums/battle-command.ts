// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CommandPhase } from "#app/phases/command-phase";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

/**
 * Commands that can be executed from a {@linkcode CommandPhase}.
 */
// Note: Do not re-order this without a good reason! The cursor positioning
// relies on their values being as they are now.
export enum BattleCommand {
  FIGHT,
  BALL,
  POKEMON,
  RUN,
  TERA,
}
