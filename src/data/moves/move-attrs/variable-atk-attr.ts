import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/moves/move";
import { MoveAttr } from "#app/data/moves/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";

/**
 * Attribute to change the offensive stat used for a move's damage calculations.
 * Moves with this attribute alter the permanent stat and stat stage-modifier
 * used when obtaining the user's attacking stat. Other stat modifiers, e.g.
 * multipliers from items and abilities, still apply based on the original stat
 * checked.
 * @extends MoveAttr
 */
export abstract class VariableAtkAttr extends MoveAttr {
  constructor() {
    super();
  }

  /**
   * Changes the offensive stat used for the current attack's damage calculation
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @param attackingStat a {@linkcode NumberHolder} containing the offensive stat
   * @param isCritical `true` if the attack should be treated as a critical strike
   * for the current attack's damage calculation
   * @returns `true` if the offensive stat is modified by this attribute
   */
  override apply(
    user: Pokemon,
    target: Pokemon,
    move: Move,
    attackingStat: NumberHolder,
    isCritical: boolean,
  ): boolean {
    attackingStat.value = this.getStatOverride(user, target, move, isCritical);
    return true;
  }

  /**
   * Obtains the stat value to override {@linkcode Pokemon.getStageMultipliedStat}
   * for offensive stat calculations during an attack.
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @param isCritical `true` if the attack should be treated as a critical strike
   * @returns the overriding stat value
   */
  abstract getStatOverride(user: Pokemon, target: Pokemon, move: Move, isCritical: boolean): number;
}
