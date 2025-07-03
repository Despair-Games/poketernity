import type { EnumValues } from "#types/utility-types";

/**
 * Specifies the type of sprite affected by an animation
 * @todo Start values at `1`
 */
export const AnimFrameTarget = {
  /**
   * Affects the animation's source or start point, e.g.
   * a Pokemon using a move.
   * @todo make this start at 1
   */
  SOURCE: 0,
  /**
   * Affects the animation's end point, e.g. a Pokemon
   * hit by a move.
   */
  TARGET: 1,
  /** Affects a component of the animation's visual effects */
  IMAGE: 2,
} as const;

/** The sprite types affected by an animation */
export type AnimFrameTarget = EnumValues<typeof AnimFrameTarget>;
