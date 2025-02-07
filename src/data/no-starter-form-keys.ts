import { SpeciesFormKey } from "#enums/species-form-key";

export const noStarterFormKeys: string[] = [
  SpeciesFormKey.MEGA,
  SpeciesFormKey.MEGA_X,
  SpeciesFormKey.MEGA_Y,
  SpeciesFormKey.PRIMAL,
  SpeciesFormKey.ORIGIN,
  SpeciesFormKey.THERIAN,
  SpeciesFormKey.GIGANTAMAX,
  SpeciesFormKey.GIGANTAMAX_RAPID,
  SpeciesFormKey.GIGANTAMAX_SINGLE,
  SpeciesFormKey.ETERNAMAX,
].map((k) => k.toString());
