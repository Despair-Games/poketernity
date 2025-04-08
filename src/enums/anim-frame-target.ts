/** Specifies the type of sprite affected by an animation */
export enum AnimFrameTarget {
  /**
   * Affects the animation's source or start point, e.g.
   * a Pokemon using a move.
   */
  SOURCE = "source",
  /**
   * Affects the animation's end point, e.g. a Pokemon
   * hit by a move.
   */
  TARGET = "target",
  /** Affects a component of the animation's visual effects */
  IMAGE = "image",
}
