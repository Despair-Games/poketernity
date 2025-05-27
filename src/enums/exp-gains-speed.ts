/**
 * Defines the speed of gaining experience.
 *
 * @remarks
 * The `expGainSpeed` can have several modes:
 * - `0` - Default: The normal speed.
 * - `1` - Fast: Fast speed.
 * - `2` - Faster: Faster speed.
 * - `3` - Skip: Skip gaining exp animation.
 *
 * @defaultValue `0`
 */
export enum ExpGainsSpeed {
  /** The normal speed. */
  DEFAULT,
  /** Fast speed. */
  FAST,
  /** Faster speed. */
  FASTER,
  /** Skip gaining exp animation. */
  SKIP,
}
