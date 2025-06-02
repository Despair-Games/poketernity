import type { ObjectValues } from "#types/utility-types";

export const AchvCategory = {
  UNSPECIFIED: -1,
  CLASSIC_VICTORY: 1,
  CHALLENGE_VICTORY: 2,
  CATCH: 3,
  PARTY: 4,
  FRIENDSHIP: 5,
  ENCOUNTER: 6,
  FORM_CHANGE: 7,
  TERASTALLIZE: 8,
  RIBBON_COUNT: 9,
  STARTER: 10,
  TEST: 11,
  CHALLENGE: 12,
} as const;

export type AchvCategory = ObjectValues<typeof AchvCategory>;
