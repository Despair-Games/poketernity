import type { ObjectValues } from "#types/utility-types";

/**
 * Enum values are base spawn weights of each tier.
 *
 * The weights aim for 46.25/31.25/18.5/4% spawn ratios, AFTER accounting for anti-variance and pity mechanisms.
 * @todo Use an enum value to spawn chance map instead of encoding the values directly in the enum.
 */
export const MysteryEncounterTier = {
  COMMON: 66,
  GREAT: 40,
  ULTRA: 19,
  EPIC: 3,
  MASTER: 0, // Not currently used
} as const;

export type MysteryEncounterTier = ObjectValues<typeof MysteryEncounterTier>;
