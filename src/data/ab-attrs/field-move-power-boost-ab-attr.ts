import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

/**
 * Boosts the power of a Pokémon's move under certain conditions.
 * @extends AbAttr
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

  override apply(
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
