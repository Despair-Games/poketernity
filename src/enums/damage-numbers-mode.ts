import type { ObjectValues } from "#types/utility-types";

export const DamageNumbersMode = {
  OFF: 0,
  SIMPLE: 1,
  FANCY: 2,
} as const;

export type DamageNumbersMode = ObjectValues<typeof DamageNumbersMode>;
