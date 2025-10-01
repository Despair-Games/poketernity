import type { EnumValues } from "#types/utility-types";

export const SpeciesFormKey = {
  MEGA: "mega",
  MEGA_X: "mega-x",
  MEGA_Y: "mega-y",
  PRIMAL: "primal",
  ORIGIN: "origin",
  INCARNATE: "incarnate",
  THERIAN: "therian",
  GIGANTAMAX: "gigantamax",
  GIGANTAMAX_SINGLE: "gigantamax-single",
  GIGANTAMAX_RAPID: "gigantamax-rapid",
  ETERNAMAX: "eternamax",
} as const;

export type SpeciesFormKey = EnumValues<typeof SpeciesFormKey>;
