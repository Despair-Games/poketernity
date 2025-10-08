import type { ObjectValues } from "#types/utility-types";

/** Modifies the speed of the experience gain animations. */
export const ExpGainSpeed = {
  /** The unmodified animation speed */
  DEFAULT: 1,
  /** 2x speed */
  FAST: 2,
  /** 4x speed */
  FASTER: 3,
  /** Skip gaining exp animation */
  SKIP: 4,
} as const;

export type ExpGainSpeed = ObjectValues<typeof ExpGainSpeed>;

export const EXP_GAIN_SPEED_MAP = {
  [ExpGainSpeed.DEFAULT]: 1,
  [ExpGainSpeed.FAST]: 1 / 2,
  [ExpGainSpeed.FASTER]: 1 / 4,
  [ExpGainSpeed.SKIP]: 0,
} as const;
