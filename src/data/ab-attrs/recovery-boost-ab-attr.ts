import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class RecoveryBoostAbAttr extends AbAttr {
  private readonly condition: PokemonAttackCondition;
  private readonly recoveryMultiplier: number;

  constructor(condition: PokemonAttackCondition, recoveryMultiplier: number, showAbility: boolean = true) {
    super(showAbility);
    this.condition = condition;
    this.recoveryMultiplier = recoveryMultiplier;
  }

  override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    move: Move,
    defender: Pokemon,
    healRatio: NumberHolder,
  ): boolean {
    if (this.condition(pokemon, defender, move)) {
      healRatio.value *= this.recoveryMultiplier;
      return true;
    }
    return false;
  }
}
