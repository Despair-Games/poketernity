import type { ObjectValues } from "#types/utility-types";

export const AchvCategory = {
  UNSPECIFIED: 1,
  CHALLENGE: 2,
} as const;

export type AchvCategory = ObjectValues<typeof AchvCategory>;
