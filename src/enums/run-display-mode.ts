import type { ObjectValues } from "#types/utility-types";

export const RunDisplayMode = {
  RUN_HISTORY: 1,
  SESSION_PREVIEW: 2,
} as const;

export type RunDisplayMode = ObjectValues<typeof RunDisplayMode>;
