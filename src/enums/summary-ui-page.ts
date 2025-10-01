import type { EnumValues } from "#types/utility-types";

// Things break if this doesn't start at `0`
export const SummaryUiPage = {
  PROFILE: 0,
  STATS: 1,
  MOVES: 2,
} as const;

export type SummaryUiPage = EnumValues<typeof SummaryUiPage>;
