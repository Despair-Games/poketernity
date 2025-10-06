import type { EnumValues } from "#types/utility-types";

export const TrainerSlot = {
  NONE: 0,
  TRAINER: 1,
  TRAINER_PARTNER: 2,
} as const;

export type TrainerSlot = EnumValues<typeof TrainerSlot>;
