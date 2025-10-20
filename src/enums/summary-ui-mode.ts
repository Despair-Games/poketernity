import type { ObjectValues } from "#types/utility-types";

export const SummaryUiMode = {
  DEFAULT: 1,
  LEARN_MOVE: 2,
} as const;

export type SummaryUiMode = ObjectValues<typeof SummaryUiMode>;
