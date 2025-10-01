import type { EnumValues } from "#types/utility-types";

export const SaveSlotUiMode = {
  LOAD: 1,
  SAVE: 2,
} as const;

export type SaveSlotUiMode = EnumValues<typeof SaveSlotUiMode>;
