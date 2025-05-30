export const AchvCategory = {
  UNSPECIFIED: 1,
  CHALLENGE: 2,
} as const;

export type AchvCategory = (typeof AchvCategory)[keyof typeof AchvCategory];
