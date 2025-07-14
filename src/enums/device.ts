import type { EnumValues } from "#types/utility-types";

export const Device = {
  GAMEPAD: 1,
  KEYBOARD: 2,
} as const;

export type Device = EnumValues<typeof Device>;
