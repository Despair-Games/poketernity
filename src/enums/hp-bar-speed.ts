import type { EnumValues } from "#types/utility-types";

/** Defines the speed of hp-bar animations */
export const HpBarSpeed = {
  /** Unmodified animation speed */
  DEFAULT: 1,
  /** 2x speed */
  FAST: 2,
  /** 4x speed */
  FASTER: 3,
  /** Skip animation */
  SKIP: 4,
} as const;

export type HpBarSpeed = EnumValues<typeof HpBarSpeed>;
