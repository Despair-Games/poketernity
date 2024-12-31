import { type Pokemon, HitResult } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute used for moves which self KO the user but only if the move hits a target
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 **/

export class SacrificialAttrOnHit extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  /** Deals damage to the user equal to their current hp if the move lands */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    // If the move fails to hit a target, then the user does not faint and the function returns false
    if (!super.apply(user, target, move)) {
      return false;
    }

    user.damageAndUpdate(user.hp, HitResult.OTHER, false, true, true);
    user.turnData.damageTaken += user.hp;

    return true;
  }

  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    if (user.isBoss()) {
      return -20;
    }
    return Math.ceil(((1 - user.getHpRatio()) * 10 - 10) * (target.getAttackTypeEffectiveness(move.type, user) - 0.5));
  }
}
