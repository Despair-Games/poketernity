import type { PokemonHeldItemModifier } from "#modifier/modifier";
import type { PokemonHeldItemModifierType } from "#modifier/modifier-type";

export interface HeldModifierConfig {
  modifier: PokemonHeldItemModifierType | PokemonHeldItemModifier;
  stackCount?: number;
  isTransferable?: boolean;
}
