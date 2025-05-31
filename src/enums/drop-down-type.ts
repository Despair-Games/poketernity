export const DropDownType = {
  SINGLE: 1,
  MULTI: 2,
  HYBRID: 3,
  RADIAL: 4,
} as const;

export type DropDownType = (typeof DropDownType)[keyof typeof DropDownType];
