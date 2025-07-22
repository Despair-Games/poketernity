import type { Modifier, PokemonHeldItemModifier } from "#modifier/modifier";
import type { PokemonHeldItemModifierType, WeightedModifierType } from "#modifier/modifier-type";

export interface ModifierPool {
  [tier: string]: WeightedModifierType[];
}

export type ModifierPredicate<T extends Modifier = Modifier> = (modifier: T) => boolean;

export interface HeldModifierConfig {
  modifier: PokemonHeldItemModifierType | PokemonHeldItemModifier;
  stackCount?: number;
  isTransferable?: boolean;
}
