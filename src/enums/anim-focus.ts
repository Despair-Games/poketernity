/**
 * Specifies the reference point (origin)
 * for x- and y-coordinates of an animation frame.
 */
export enum AnimFocus {
  /** Centers the animation frame on the targeted Pokemon */
  TARGET = 1,
  /** Centers the animation frame on the source Pokemon */
  USER,
  /**
   * Centers the animation frame on the midpoint of the line between
   * the source and target Pokemon
   * @todo is this correct?
   */
  USER_TARGET,
  /**
   * Centers the animation frame on the default player reference point
   * (i.e. [106, 116])
   */
  SCREEN,
}
