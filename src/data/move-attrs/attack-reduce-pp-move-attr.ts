import type { Pokemon, TurnMove } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { ReducePpMoveAttr } from "#app/data/move-attrs/reduce-pp-move-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute to reduce the PP of the target's last move after attacking.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Eerie_Spell_(move) | Eerie Spell}.
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/G-Max_Depletion_(move) | G-Max Max_Depletion}
 * @extends ReducePpMoveAttr
 */
export class AttackReducePpMoveAttr extends ReducePpMoveAttr {
  private affectBothOpponents: boolean;

  constructor(reduction: number, affectBothOpponents: boolean = false) {
    super(reduction);
    this.affectBothOpponents = affectBothOpponents;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const lastMoveTarget = target.getLastXMoves().find(() => true);
    if (lastMoveTarget) {
      this.reducePP(user, target, move, lastMoveTarget);
    }

    if (this.affectBothOpponents && target.getAlly()?.isActive(true)) {
      const lastMoveTargetAlly = target
        .getAlly()
        .getLastXMoves()
        .find(() => true);
      if (lastMoveTargetAlly) {
        this.reducePP(user, target.getAlly(), move, lastMoveTargetAlly);
      }
    }

    return true;
  }

  private reducePP(user: Pokemon, target: Pokemon, move: Move, lastMoveTarget: TurnMove) {
    const movesetMove = target.getMoveset().find((m) => m.moveId === lastMoveTarget.move);
    if (Boolean(movesetMove?.getPpRatio())) {
      super.apply(user, target, move);
    }
  }

  // Override condition function to always perform damage. Instead, perform pp-reduction condition check in apply function above
  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) => true;
  }
}
