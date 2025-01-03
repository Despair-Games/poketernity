import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { ReducePpMoveAttr } from "#app/data/move-attrs/reduce-pp-move-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute to reduce the PP of the target's last move after attacking.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Eerie_Spell_(move) Eerie Spell}.
 * @extends ReducePpMoveAttr
 */
export class AttackReducePpMoveAttr extends ReducePpMoveAttr {
  constructor(reduction: number) {
    super(reduction);
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const lastMove = target.getLastXMoves().find(() => true);
    if (lastMove) {
      const movesetMove = target.getMoveset().find((m) => m.moveId === lastMove.move);
      if (Boolean(movesetMove?.getPpRatio())) {
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
