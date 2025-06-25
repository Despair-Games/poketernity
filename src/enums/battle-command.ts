// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { CommandPhase } from "#phases/command-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

/**
 * Commands that can be executed from a {@linkcode CommandPhase}.
 *
 * @todo Decouple values from cursor positioning
 */
// Note: Do not re-order this without a good reason! The cursor positioning
// relies on their values being as they are now.
export const BattleCommand = {
  FIGHT: 0,
  BALL: 1,
  POKEMON: 2,
  RUN: 3,
  TERA: 4,
} as const;

export type BattleCommand = (typeof BattleCommand)[keyof typeof BattleCommand];
