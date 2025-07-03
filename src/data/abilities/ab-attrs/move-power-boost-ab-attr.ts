import { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/move-types";
import type { NumberHolder } from "#utils/common-utils";

export class MovePowerBoostAbAttr extends VariableMovePowerAbAttr {
  private readonly condition: PokemonAttackCondition;
  private readonly powerMultiplier: number;

  constructor(condition: PokemonAttackCondition, powerMultiplier: number, showAbility: boolean = true) {
    super(showAbility);
    this.condition = condition;
    this.powerMultiplier = powerMultiplier;
  }

  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    move: Move,
    defender: Pokemon,
    power: NumberHolder,
  ): boolean {
    if (this.condition(pokemon, defender, move)) {
      power.value *= this.powerMultiplier;
      return true;
    }
    return false;
  }
}
