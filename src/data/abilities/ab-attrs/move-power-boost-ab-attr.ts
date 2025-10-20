import { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/move-types";
import type { ValueHolder } from "#utils/common-utils";

export class MovePowerBoostAbAttr extends VariableMovePowerAbAttr {
  private readonly condition: PokemonAttackCondition;
  private readonly powerMultiplier: number;

  constructor(condition: PokemonAttackCondition, powerMultiplier: number) {
    super();
    this.condition = condition;
    this.powerMultiplier = powerMultiplier;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: Move,
    _defender: Pokemon,
    power: ValueHolder<number>,
  ): void {
    power.value *= this.powerMultiplier;
  }

  public override canApply(...[pokemon, , move, defender]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, defender, move);
  }
}
