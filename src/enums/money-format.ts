import type { ObjectValues } from "#types/utility-types";

export const MoneyFormat = {
  NORMAL: 1,
  ABBREVIATED: 2,
} as const;

export type MoneyFormat = ObjectValues<typeof MoneyFormat>;
