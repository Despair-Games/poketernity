export enum AbilityApplyMode {
  /** Applies abilities as normal, without restrictions */
  DEFAULT,
  /** Only applies abilities that were previously applied in the current battle */
  REVEALED,
  /** Prevents abilities from applying altogether */
  IGNORE,
}
