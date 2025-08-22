import type { EnumValues } from "#types/utility-types";

/**
 * An enum describing what level a Pokemon should be.
 *
 * Used in {@linkcode getPartyLevels}
 */
export const PartyMemberStrength = {
  WEAKEST: 1,
  WEAKER: 2,
  WEAK: 3,
  AVERAGE: 4,
  STRONG: 5,
  STRONGER: 6,
} as const;

export type PartyMemberStrength = EnumValues<typeof PartyMemberStrength>;
