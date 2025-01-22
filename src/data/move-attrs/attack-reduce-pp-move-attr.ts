import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { ReducePpMoveAttr } from "#app/data/move-attrs/reduce-pp-move-attr";
import type { MoveConditionFunc } from "../move-conditions";
import { globalScene } from "#app/global-scene";

/**
 * Attribute to reduce the PP of the target's last move after attacking.
 * Used for {@linkcode https://bulbapedia.bulbagarden.net/wiki/Eerie_Spell_(move) | Eerie Spell}.
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/G-Max_Depletion_(move) | G-Max Max_Depletion}
 * @extends ReducePpMoveAttr
 */
export class AttackReducePpMoveAttr extends ReducePpMoveAttr {
  private affectsBothOpponents: boolean;

  constructor(reduction: number, affectsBothOpponents: boolean = false) {
    super(reduction);
    this.affectsBothOpponents = affectsBothOpponents;
  }

  /**
   * Attempts to reduce the pp of the target (and its ally if affectsBothOpponents is true)'s
   * last used move
   * @param user the user of the move
   * @param target the target of the attack
   * @param move the move (eerie spell or g-max depletion)
   * @returns true
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (this.affectsBothOpponents) {
      const allOpps = globalScene.getActiveOpps(target);
      allOpps.forEach((opp) => {
        this.reducePP(user, opp, move);
      });
    } else {
      this.reducePP(user, target, move);
    }

    return true;
  }

  private reducePP(user: Pokemon, target: Pokemon, move: Move): void {
    const lastMoveTarget = target.getLastXMoves().find(() => true);
    if (lastMoveTarget) {
      const movesetMove = target.getMoveset().find((m) => m.moveId === lastMoveTarget.move);
      if (Boolean(movesetMove?.getPpRatio())) {
        super.apply(user, target, move);
      }
    }
  }

  // Override condition function to always perform damage. Instead, perform pp-reduction condition check in apply function above
  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) => true;
  }
}
