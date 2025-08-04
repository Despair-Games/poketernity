import type { EnumValues } from "#types/utility-types";

export const Button = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
  SUBMIT: 5,
  ACTION: 6,
  CANCEL: 7,
  MENU: 8,
  STATS: 9,
  CYCLE_SHINY: 10,
  CYCLE_FORM: 11,
  CYCLE_GENDER: 12,
  CYCLE_ABILITY: 13,
  CYCLE_NATURE: 14,
  CYCLE_TERA: 15,
  SPEED_UP: 16,
  SLOW_DOWN: 17,
} as const;

export type Button = EnumValues<typeof Button>;
