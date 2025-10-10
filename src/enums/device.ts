import type { ObjectValues } from "#types/utility-types";

export const Device = {
  GAMEPAD: 1,
  KEYBOARD: 2,
} as const;

export type Device = ObjectValues<typeof Device>;
