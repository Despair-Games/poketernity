import type { EnumValues } from "#types/utility-types";

export const AiType = {
  RANDOM: 1,
  SMART_RANDOM: 2,
  SMART: 3,
} as const;

export type AiType = EnumValues<typeof AiType>;
