import type { Pokemon } from "#field/pokemon";
import type { ObjectValues } from "#types/utility-types";

/**
 * Denotes which side of the field an effect applies,
 * relative to the {@linkcode Pokemon} invoking the effect.
 */
export const ArenaTagRelativeSide = {
  USER: 1,
  TARGET: 2,
  ALL: 3,
} as const;

export type ArenaTagRelativeSide = ObjectValues<typeof ArenaTagRelativeSide>;
