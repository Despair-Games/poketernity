import type { ObjectValues } from "#types/utility-types";

export const TrainerGender = {
  DEFAULT: 0,
  MALE: 1,
  FEMALE: 2,
} as const;

export type TrainerGender = ObjectValues<typeof TrainerGender>;
