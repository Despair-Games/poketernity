import type { ObjectValues } from "#types/utility-types";

// TODO: decouple enum value from cursor position
export const EggSourceType = {
  GACHA_MOVE: 0,
  GACHA_LEGENDARY: 1,
  GACHA_SHINY: 2,
  SAME_SPECIES_EGG: 3,
  EVENT: 4,
} as const;

export type EggSourceType = ObjectValues<typeof EggSourceType>;
