export const Device = {
  GAMEPAD: 1,
  KEYBOARD: 2,
} as const;

export type Device = (typeof Device)[keyof typeof Device];
