import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { NumberHolder } from "#utils/common-utils";

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
