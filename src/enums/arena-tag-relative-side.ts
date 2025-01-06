// tsdoc imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Pokemon } from "#app/field/pokemon";

/**
 * Denotes which side of the field an effect applies,
 * relative to the {@linkcode Pokemon} invoking the effect.
 */
export enum ArenaTagRelativeSide {
  USER,
  TARGET,
  ALL,
}
