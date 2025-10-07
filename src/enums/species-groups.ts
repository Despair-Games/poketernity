import type { EnumValues } from "#types/utility-types";

export const SpeciesGroups = {
  COMMON: 1,
  ULTRA_BEAST: 2,
  PARADOX: 3,
  SUBLEGENDARY: 4,
  LEGENDARY: 5,
  MYTHICAL: 6,
} as const;

export type SpeciesGroups = EnumValues<typeof SpeciesGroups>;
