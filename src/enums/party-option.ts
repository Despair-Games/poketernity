import type { ObjectValues } from "#types/utility-types";

export const PartyOption = {
  CANCEL: -1,
  SEND_OUT: 1,
  PASS_BATON: 2,
  REVIVE: 3,
  APPLY: 4,
  TEACH: 5,
  TRANSFER: 6,
  SUMMARY: 7,
  UNPAUSE_EVOLUTION: 8,
  RELEASE: 9,
  RENAME: 10,
  SELECT: 11,
  SCROLL_UP: 1000,
  SCROLL_DOWN: 1001,
  FORM_CHANGE_ITEM: 2000,
  MOVE_1: 3000,
  MOVE_2: 3001,
  MOVE_3: 3002,
  MOVE_4: 3003,
  ALL: 4000,
} as const;

export type PartyOption = ObjectValues<typeof PartyOption>;
