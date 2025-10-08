import type { ObjectValues } from "#types/utility-types";

/** Determines exp notification style */
export const ExpNotification = {
  /** Display EXP gain normally */
  DEFAULT: 1,
  /** Display level ups in a small flyout instead of as a message */
  ONLY_LEVEL_UP: 2,
  /** Don't display a message or a flyout */
  SKIP: 3,
} as const;

export type ExpNotification = ObjectValues<typeof ExpNotification>;
