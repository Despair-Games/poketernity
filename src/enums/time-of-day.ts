import type { ObjectValues } from "#types/utility-types";

export const TimeOfDay = {
  ALL: -1,
  DAWN: 1,
  DAY: 2,
  DUSK: 3,
  NIGHT: 4,
} as const;

export type TimeOfDay = ObjectValues<typeof TimeOfDay>;
