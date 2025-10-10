import type { ObjectValues } from "#types/utility-types";

export const BiomePoolTier = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  SUPER_RARE: 4,
  ULTRA_RARE: 5,
  BOSS: 6,
  BOSS_RARE: 7,
  BOSS_SUPER_RARE: 8,
  BOSS_ULTRA_RARE: 9,
} as const;

export type BiomePoolTier = ObjectValues<typeof BiomePoolTier>;
