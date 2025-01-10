import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

/**
 * Class for abilities that boost the damage of moves
 * For abilities that boost the base power of moves, see {@linkcode VariableMovePowerAbAttr}
 * @param damageMultiplier the amount to multiply the damage by
 * @param condition the condition for this ability to be applied
 */
export class DamageBoostAbAttr extends PreAttackAbAttr {
  private readonly damageMultiplier: number;
  private readonly condition: PokemonAttackCondition;

  constructor(damageMultiplier: number, condition: PokemonAttackCondition) {
    super(true);
    this.damageMultiplier = damageMultiplier;
    this.condition = condition;
  }

  /**
   * Multiplies a move's damage by {@linkcode damageMultiplier}
   * if the attribute's {@linkcode condition} is met.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param defender The {@linkcode Pokemon} targeted by the move
   * @param move The {@linkcode Move} being used
   * @param multiplier A {@linkcode NumberHolder} containing a damage
   * multiplier for the current attack.
   * @returns `true` if this effect modified the given move's damage
   */
  override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    defender: Pokemon,
    move: Move,
    multiplier: NumberHolder,
  ): boolean {
    if (this.condition(pokemon, defender, move)) {
      multiplier.value *= this.damageMultiplier;
      return true;
    }

    return false;
  }
}
