import type { ObjectValues } from "#types/utility-types";

export const TrainerPoolTier = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  SUPER_RARE: 4,
  ULTRA_RARE: 5,
} as const;

export type TrainerPoolTier = ObjectValues<typeof TrainerPoolTier>;
