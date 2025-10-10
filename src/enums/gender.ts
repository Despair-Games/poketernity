import type { ObjectValues } from "#types/utility-types";

export const Gender = {
  GENDERLESS: -1,
  MALE: 1,
  FEMALE: 2,
} as const;

export type Gender = ObjectValues<typeof Gender>;
