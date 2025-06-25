/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { Pokemon } from "#field/pokemon";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

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
