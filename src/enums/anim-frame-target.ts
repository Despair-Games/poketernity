/** Specifies the type of sprite affected by an animation */
export const AnimFrameTargets = {
  /**
   * Affects the animation's source or start point, e.g.
   * a Pokemon using a move.
   */
  SOURCE: "source",
  /**
   * Affects the animation's end point, e.g. a Pokemon
   * hit by a move.
   */
  TARGET: "target",
  /** Affects a component of the animation's visual effects */
  IMAGE: "image",
} as const;

/** The sprite types affected by an animation */
export type AnimFrameTarget = (typeof AnimFrameTargets)[keyof typeof AnimFrameTargets];
