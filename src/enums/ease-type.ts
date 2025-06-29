import type { EnumValues } from "#types/enum-values";

export const EaseType = {
  NONE: 0,
  LINEAR: "Linear",
  QUADRATIC: "Quad",
  CUBIC: "Cubic",
  QUARTIC: "Quart",
  QUINTIC: "Quint",
  SINUSOIDAL: "Sine",
  EXPONENTIAL: "Expo",
  CIRCULAR: "Circ",
  ELASTIC: "Elastic",
  BACK: "Back",
  BOUNCE: "Bounce",
  STEPPED: "Stepped",
} as const;

export type EaseType = EnumValues<typeof EaseType>;
