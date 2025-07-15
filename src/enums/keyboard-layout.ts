import type { EnumValues } from "#types/enum-values";

export const KeyboardLayout = {
  QWERTY: 1, // default
  AZERTY: 2,
} as const;

export type KeyboardLayout = EnumValues<typeof KeyboardLayout>;
