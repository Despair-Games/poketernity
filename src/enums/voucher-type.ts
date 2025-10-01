import type { EnumValues } from "#types/utility-types";

// Note: some code expects this to start at `0`
export const VoucherType = {
  REGULAR: 0,
  PLUS: 1,
  PREMIUM: 2,
  GOLDEN: 3,
} as const;

export type VoucherType = EnumValues<typeof VoucherType>;
