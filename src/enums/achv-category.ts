import type { EnumValues } from "#types/utility-types";

export const AchvCategory = {
  UNSPECIFIED: 1,
  CHALLENGE: 2,
} as const;

export type AchvCategory = EnumValues<typeof AchvCategory>;
