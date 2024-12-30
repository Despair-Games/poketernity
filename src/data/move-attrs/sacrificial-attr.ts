import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { type Pokemon, HitResult } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute used for moves which self KO the user regardless if the move hits a target
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 **/

export class SacrificialAttr extends MoveEffectAttr {
  constructor() {
    super(true, { trigger: MoveEffectTrigger.POST_TARGET });
  }

  /**
   * Deals damage to the user equal to their current hp
   * @param user {@linkcode Pokemon} that used the move
   * @param _target {@linkcode Pokemon} target of the move
   * @param _move {@linkcode Move} with this attribute
   * @returns true if the function succeeds
   **/
  override apply(user: Pokemon, _target: Pokemon, _move: Move): boolean {
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
