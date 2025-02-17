import type { WeightedModifierType } from "#app/modifier/modifier-type";

export interface ModifierPool {
  [tier: string]: WeightedModifierType[];
}
