import type { ObjectValues } from "#types/utility-types";

export const SortDirection = {
  ASC: -1,
  DESC: 1,
} as const;

export type SortDirection = ObjectValues<typeof SortDirection>;
