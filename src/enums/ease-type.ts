import type { ObjectValues } from "#types/utility-types";

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

export type EaseType = ObjectValues<typeof EaseType>;
