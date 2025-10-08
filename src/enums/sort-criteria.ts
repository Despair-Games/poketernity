import type { ObjectValues } from "#types/utility-types";

export const SortCriteria = {
  NUMBER: 1,
  COST: 2,
  CANDY: 3,
  IV: 4,
  NAME: 5,
} as const;

export type SortCriteria = ObjectValues<typeof SortCriteria>;
