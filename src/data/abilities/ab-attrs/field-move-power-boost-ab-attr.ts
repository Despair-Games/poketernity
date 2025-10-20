import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/move-types";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Boosts the power of a Pokémon's move under certain conditions.
 */
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

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: Move,
    _defender: Pokemon,
    movePower: NumberHolder,
  ): void {
    movePower.value *= this.powerMultiplier;
  }

  public override canApply(...[pokemon, , move, defender]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, defender, move);
  }
}
