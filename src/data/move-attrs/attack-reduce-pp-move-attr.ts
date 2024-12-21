import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { ReducePpMoveAttr } from "#app/data/move-attrs/reduce-pp-move-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 *  Attribute used for moves that damage target, and then reduce PP of the target's last used move.
 *  Used for Eerie Spell.
 */
export class AttackReducePpMoveAttr extends ReducePpMoveAttr {
  constructor(reduction: number) {
    super(reduction);
  }

  /**
   * Checks if the target has used a move prior to the attack. PP-reduction is applied through the super class if so.
   *
   * @param user {@linkcode Pokemon} that used the attack
   * @param target {@linkcode Pokemon} targeted by the attack
   * @param move {@linkcode Move} being used
   * @param args N/A
   * @returns `true`
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const lastMove = target.getLastXMoves().find(() => true);
    if (lastMove) {
      const movesetMove = target.getMoveset().find((m) => m.moveId === lastMove.move);
      if (Boolean(movesetMove?.getPpRatio())) {
        super.apply(user, target, move, args);
      }
    }

    return true;
  }

  // Override condition function to always perform damage. Instead, perform pp-reduction condition check in apply function above
  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) => true;
  }
}
