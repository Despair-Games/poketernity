import type { EnumValues } from "#types/utility-types";

export const KeyboardLayout = {
  QWERTY: 1, // default
  QWERTZ: 2,
  AZERTY: 3,
} as const;

export type KeyboardLayout = EnumValues<typeof KeyboardLayout>;
