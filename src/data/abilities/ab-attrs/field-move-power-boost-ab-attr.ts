import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/pokemon-attack-condition";
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
    super(false);
    this.condition = condition;
    this.powerMultiplier = powerMultiplier;
  }

  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    move: Move,
    defender: Pokemon,
    movePower: NumberHolder,
  ): boolean {
    if (this.condition(pokemon, defender, move)) {
      movePower.value *= this.powerMultiplier;

      return true;
    }

    return false;
  }
}
