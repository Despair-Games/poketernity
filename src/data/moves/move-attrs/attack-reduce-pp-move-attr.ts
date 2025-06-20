import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { ReducePpMoveAttr } from "#moves/reduce-pp-move-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";

/**
 * Attribute to reduce the PP of the target's last move after attacking.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Eerie_Spell_(move) | Eerie Spell}.
 */
export class AttackReducePpMoveAttr extends ReducePpMoveAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const lastMove = target.getLastXMoves().find(() => true);
    if (lastMove) {
      const movesetMove = target.getMoveset().find((m) => m.moveId === lastMove.move.id);
      if (movesetMove?.getPpRatio()) {
        super.apply(user, target, move);
      }
    }

    return true;
  }

  // Override condition function to always perform damage. Instead, perform pp-reduction condition check in apply function above
  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) => true;
  }
}
