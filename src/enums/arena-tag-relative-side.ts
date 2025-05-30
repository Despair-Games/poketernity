// tsdoc imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Pokemon } from "#field/pokemon";

/**
 * Denotes which side of the field an effect applies,
 * relative to the {@linkcode Pokemon} invoking the effect.
 */
export const ArenaTagRelativeSide = {
  USER: 1,
  TARGET: 2,
  ALL: 3,
} as const;

export type ArenaTagRelativeSide = (typeof ArenaTagRelativeSide)[keyof typeof ArenaTagRelativeSide];
