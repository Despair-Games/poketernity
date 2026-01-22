import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import type { FieldMovePowerBoostAbAttrParams } from "#types/ab-attr-param-types";
import type { PokemonAttackCondition } from "#types/move-types";

/** Boosts the power of a Pokémon's move under certain conditions. */
export abstract class FieldMovePowerBoostAbAttr extends PreAttackAbAttr {
  private readonly condition: PokemonAttackCondition;
  private readonly powerMultiplier: number;

  /**
   * @param condition - A function that determines whether the power boost condition is met.
   * @param powerMultiplier - The multiplier to apply to the move's power when the condition is met.
   */
  constructor(condition: PokemonAttackCondition, powerMultiplier: number) {
    super();

    this.condition = condition;
    this.powerMultiplier = powerMultiplier;
  }

  public override apply({ power }: FieldMovePowerBoostAbAttrParams): void {
    power.value *= this.powerMultiplier;
  }

  public override canApply({ pokemon, move, defender }: Parameters<this["apply"]>[0]): boolean {
    return this.condition(pokemon, defender, move);
  }
}
