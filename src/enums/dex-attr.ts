/** Flags used to mark seen/caught elements of each species in dex data. */
export const DexAttr = {
  NON_SHINY: 1n,
  SHINY_BASE_VARIANT: 2n,
  SHINY_RARE_VARIANT: 4n,
  SHINY_EPIC_VARIANT: 8n,
  MALE: 16n,
  FEMALE: 32n,
  /**
   * Marks the first flag of a species' forms. It must be the last attribute since
   * it will be followed by the flags for the other forms, depending on the species.
   */
  DEFAULT_FORM: 64n,
} as const;
