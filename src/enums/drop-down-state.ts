export const DropDownState = {
  ON: 1,
  OFF: 2,
  EXCLUDE: 3,
  UNLOCKABLE: 4,
  PARTIAL: 5,
} as const;

export type DropDownState = (typeof DropDownState)[keyof typeof DropDownState];
