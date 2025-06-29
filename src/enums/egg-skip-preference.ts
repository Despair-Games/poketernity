import type { EnumValues } from "#types/enum-values";

/** Defines the preference of egg skipping */
export const EggSkipPreference = {
  /** Never skip eggs hatching. */
  NEVER: 1,
  /** Ask to skip eggs hatching. */
  ASK: 2,
  /** Always skip eggs hatching. */
  ALWAYS: 3,
} as const;

export type EggSkipPreference = EnumValues<typeof EggSkipPreference>;
