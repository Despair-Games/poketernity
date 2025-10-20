import type { ObjectValues } from "#types/utility-types";

export const SaveSlotUiMode = {
  LOAD: 1,
  SAVE: 2,
} as const;

export type SaveSlotUiMode = ObjectValues<typeof SaveSlotUiMode>;
