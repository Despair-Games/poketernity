import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { type Pokemon } from "#app/field/pokemon";
import { HitResult } from "#enums/hit-result";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";

/**
 * Attribute used for moves which self KO the user regardless if the move hits a target
 * @extends MoveEffectAttr
 */
export class SacrificialAttr extends MoveEffectAttr {
  constructor(onHit: boolean = false) {
    super(true, { trigger: onHit ? MoveEffectTrigger.POST_APPLY : MoveEffectTrigger.POST_TARGET });
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    user.damageAndUpdate(user.hp, {
      result: HitResult.OTHER,
      ignoreSegments: true,
      preventEndure: true,
      ignoreDynamaxReduction: true,
    });

    return true;
  }

  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    if (user.isBoss()) {
      return -20;
    }
    return Math.ceil(((1 - user.getHpRatio()) * 10 - 10) * (target.getAttackTypeEffectiveness(move.type, user) - 0.5));
  }
}
