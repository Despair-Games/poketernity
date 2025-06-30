import type { EnumValues } from "#types/enum-values";

export const EggTier = {
  COMMON: 0,
  RARE: 1,
  EPIC: 2,
  LEGENDARY: 3,
} as const;

export type EggTier = EnumValues<typeof EggTier>;
