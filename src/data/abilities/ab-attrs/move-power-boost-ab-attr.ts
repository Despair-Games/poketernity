import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { VariableMovePowerAbAttr } from "./variable-move-power-ab-attr";

export class MovePowerBoostAbAttr extends VariableMovePowerAbAttr {
  private readonly condition: PokemonAttackCondition;
  private readonly powerMultiplier: number;

  constructor(condition: PokemonAttackCondition, powerMultiplier: number, showAbility: boolean = true) {
    super(showAbility);
    this.condition = condition;
    this.powerMultiplier = powerMultiplier;
  }

  override apply(pokemon: Pokemon, _simulated: boolean, move: Move, defender: Pokemon, power: NumberHolder): boolean {
    if (this.condition(pokemon, defender, move)) {
      power.value *= this.powerMultiplier;
      return true;
    }
    return false;
  }
}
