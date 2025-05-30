export const AiType = {
  RANDOM: 1,
  SMART_RANDOM: 2,
  SMART: 3,
} as const;

export type AiType = (typeof AiType)[keyof typeof AiType];
