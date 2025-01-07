import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute to change a move's legal target set based on game state.
 * @extends MoveAttr
 */
export class VariableTargetAttr extends MoveAttr {
  private targetChangeFunc: (user: Pokemon, target: Pokemon, move: Move) => number;

  constructor(targetChange: (user: Pokemon, target: Pokemon, move: Move) => number) {
    super();

    this.targetChangeFunc = targetChange;
  }

  /**
   * Changes the move's target according to this attribute's
   * {@linkcode targetChangeFunc}
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @param newTarget a {@linkcode NumberHolder} containing the move's adjusted target
   * @returns `true`
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, newTarget: NumberHolder): boolean {
    newTarget.value = this.targetChangeFunc(user, target, move);
    return true;
  }
}
