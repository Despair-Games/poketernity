import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class BypassSleepAttr extends MoveAttr {
  override apply(user: Pokemon, _target: Pokemon, move: Move, _args: any[]): boolean {
    if (user.status?.effect === StatusEffect.SLEEP) {
      user.addTag(BattlerTagType.BYPASS_SLEEP, 1, move.id, user.id);
      return true;
    }

    return false;
  }

  /**
   * Returns arbitrarily high score when Pokemon is asleep, otherwise shouldn't be used
   * @param user
   * @param _target
   * @param _move
   */
  override getUserBenefitScore(user: Pokemon, _target: Pokemon, _move: Move): number {
    return user.status && user.status.effect === StatusEffect.SLEEP ? 200 : -10;
  }
}
