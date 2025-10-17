import type { ObjectValues } from "#types/utility-types";

export const StatusEffect = {
  NONE: 0,
  POISON: 1,
  TOXIC: 2,
  PARALYSIS: 3,
  SLEEP: 4,
  FREEZE: 5,
  BURN: 6,
} as const;

export type StatusEffect = ObjectValues<typeof StatusEffect>;
