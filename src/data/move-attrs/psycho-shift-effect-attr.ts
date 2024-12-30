import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { type Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class PsychoShiftEffectAttr extends MoveEffectAttr {
  constructor() {
    super(false);
  }

  /**
   * Applies the effect of Psycho Shift to its target
   * Psycho Shift takes the user's status effect and passes it onto the target. The user is then healed after the move has been successfully executed.
   * @returns `true` if Psycho Shift's effect is able to be applied to the target
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const statusToApply: StatusEffect | undefined =
      user.status?.effect ?? (user.hasAbility(Abilities.COMATOSE) ? StatusEffect.SLEEP : undefined);

    if (target.status) {
      return false;
    } else {
      const canSetStatus = target.canSetStatus(statusToApply, true, false, user);
      const trySetStatus = canSetStatus ? target.trySetStatus(statusToApply, true, user) : false;

      if (trySetStatus && user.status) {
        // PsychoShiftTag is added to the user if move succeeds so that the user is healed of its status effect after its move
        user.addTag(BattlerTagType.PSYCHO_SHIFT);
      }

      return trySetStatus;
    }
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, _move: Move): number {
    return !target.status && target.canSetStatus(user.status?.effect, true, false, user) ? -10 : 0;
  }
}
