import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { type Pokemon } from "#app/field/pokemon";
import { HitResult } from "#enums/hit-result";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute used for moves which self KO the user regardless if the move hits a target
 * @extends MoveEffectAttr
 */
export class SacrificialAttr extends MoveEffectAttr {
  constructor(onHit: boolean = false) {
    super(true, { trigger: onHit ? MoveEffectTrigger.POST_APPLY : MoveEffectTrigger.POST_TARGET });
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
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
