/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/move-types";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Class for abilities that boost the damage of moves
 * For abilities that boost the base power of moves, see {@linkcode VariableMovePowerAbAttr}
 * @param damageMultiplier the amount to multiply the damage by
 * @param condition the condition for this ability to be applied
 */
export class DamageBoostAbAttr extends PreAttackAbAttr {
  protected override readonly abAttrKey = "DamageBoostAbAttr";
  private readonly damageMultiplier: number;
  private readonly condition: PokemonAttackCondition;

  constructor(damageMultiplier: number, condition: PokemonAttackCondition) {
    super();
    this.damageMultiplier = damageMultiplier;
    this.condition = condition;
  }

  /**
   * Multiplies a move's damage by {@linkcode damageMultiplier}
   * if the attribute's {@linkcode condition} is met.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param move The {@linkcode Move} being used
   * @param defender The {@linkcode Pokemon} targeted by the move
   * @param multiplier A {@linkcode ValueHolder} containing a damage
   * multiplier for the current attack.
   * @returns `true` if this effect modified the given move's damage
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: Move,
    _defender: Pokemon,
    multiplier: ValueHolder<number>,
  ): void {
    multiplier.value *= this.damageMultiplier;
  }

  public override canApply(...[pokemon, , move, defender]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, defender, move);
  }
}
