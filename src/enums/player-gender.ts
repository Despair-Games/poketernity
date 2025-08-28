import type { EnumValues } from "#types/utility-types";

export const PlayerGender = {
  UNSET: 0,
  MALE: 1,
  FEMALE: 2,
} as const;

export type PlayerGender = EnumValues<typeof PlayerGender>;
