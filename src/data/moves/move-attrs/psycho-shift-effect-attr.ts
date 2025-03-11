import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { type Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Psycho_Shift_(move) | Psycho Shift}'s effect.
 * Passes the user's status effect onto the target, then heals the user.
 * @extends MoveEffectAttr
 */
export class PsychoShiftEffectAttr extends MoveEffectAttr {
  constructor() {
    super(false);
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const statusToApply = this.getStatusToApply(user);

    if (!statusToApply) {
      return false;
    }

    if (target.hasNonVolatileStatusEffect()) {
      return false;
    } else {
      const canSetStatus = target.canSetStatus(statusToApply, true, false, user);
      const trySetStatus = canSetStatus ? target.trySetStatus(statusToApply, true, user) : false;

      if (trySetStatus && user.hasNonVolatileStatusEffect()) {
        // PsychoShiftTag is added to the user if move succeeds so that the user is healed of its status effect after its move
        user.addTag(BattlerTagType.PSYCHO_SHIFT);
      }

      return trySetStatus;
    }
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, _move: Move): number {
    const statusToApply = this.getStatusToApply(user);
    return !target.hasNonVolatileStatusEffect()
      && statusToApply !== StatusEffect.NONE
      && target.canSetStatus(statusToApply, true, false, user)
      ? -10
      : 0;
  }

  private getStatusToApply(user: Pokemon): StatusEffect {
    return user.getStatusEffect();
  }
}
