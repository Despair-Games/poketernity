import type { EnumValues } from "#types/utility-types";

export const TrainerVariant = {
  DEFAULT: 1,
  FEMALE: 2,
  DOUBLE: 3,
} as const;

export type TrainerVariant = EnumValues<typeof TrainerVariant>;
