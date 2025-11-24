import type { ObjectValues } from "#types/utility-types";

export const TrainerGender = {
  MALE: 1,
  FEMALE: 2,
} as const;

export type TrainerGender = ObjectValues<typeof TrainerGender>;
