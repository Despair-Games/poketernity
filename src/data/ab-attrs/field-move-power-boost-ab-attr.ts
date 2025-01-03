import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * Boosts the power of a Pokémon's move under certain conditions.
 * @extends AbAttr
 */
export class FieldMovePowerBoostAbAttr extends AbAttr {
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

  applyPreAttack(
    pokemon: Pokemon | null,
    _passive: boolean | null,
    _simulated: boolean,
    defender: Pokemon | null,
    move: Move,
    args: any[],
  ): boolean {
    if (this.condition(pokemon, defender, move)) {
      const movePower: NumberHolder = args[0];
      movePower.value *= this.powerMultiplier;

      return true;
    }

    return false;
  }
}
