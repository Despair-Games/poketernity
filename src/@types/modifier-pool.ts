import type { WeightedModifierType } from "#modifier/modifier-type";

export interface ModifierPool {
  [tier: string]: WeightedModifierType[];
}
