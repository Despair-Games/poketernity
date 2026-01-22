import { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import type { VariableMovePowerAbAttrParams } from "#types/ab-attr-param-types";
import type { PokemonAttackCondition } from "#types/move-types";

export class MovePowerBoostAbAttr extends VariableMovePowerAbAttr {
  private readonly condition: PokemonAttackCondition;
  private readonly powerMultiplier: number;

  constructor(condition: PokemonAttackCondition, powerMultiplier: number) {
    super();

    this.condition = condition;
    this.powerMultiplier = powerMultiplier;
  }

  public override apply({ power }: VariableMovePowerAbAttrParams): void {
    power.value *= this.powerMultiplier;
  }

  public override canApply({ pokemon, move, defender }: Parameters<this["apply"]>[0]): boolean {
    return this.condition(pokemon, defender, move);
  }
}
