import type { ObjectValues } from "#types/utility-types";

export const TrainerGender = {
  DEFAULT: 1,
  MALE: 2,
  FEMALE: 3,
} as const;

export type TrainerGender = ObjectValues<typeof TrainerGender>;
export type NonDefaultTrainerGender = Exclude<TrainerGender, typeof TrainerGender.DEFAULT>;
