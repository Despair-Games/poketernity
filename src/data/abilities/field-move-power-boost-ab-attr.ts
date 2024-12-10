import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Pokemon from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type Move from "../move";
import { AbAttr } from "./ab-attr";

/**
 * Boosts the power of a Pokémon's move under certain conditions.
 * @extends AbAttr
 */
export class FieldMovePowerBoostAbAttr extends AbAttr {
  private condition: PokemonAttackCondition;
  private powerMultiplier: number;

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
      (args[0] as NumberHolder).value *= this.powerMultiplier;

      return true;
    }

    return false;
  }
}
