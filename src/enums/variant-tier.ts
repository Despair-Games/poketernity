import type { EnumValues } from "#types/utility-types";

// Changing this to start at `1` breaks things
/** Tiers for shiny variants */
export const VariantTier = {
  STANDARD: 0,
  RARE: 1,
  EPIC: 2,
} as const;

export type VariantTier = EnumValues<typeof VariantTier>;
