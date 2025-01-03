import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute to allow the user to use the associated move while asleep.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Snore_(move) Snore}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Sleep_Talk_(move) Sleep Talk}.
 * @extends MoveAttr
 */
export class BypassSleepAttr extends MoveAttr {
  override apply(user: Pokemon, _target: Pokemon, move: Move): boolean {
    if (user.status?.effect === StatusEffect.SLEEP) {
      user.addTag(BattlerTagType.BYPASS_SLEEP, 1, move.id, user.id);
      return true;
    }

    return false;
  }

  /** Returns arbitrarily high score when Pokemon is asleep, otherwise shouldn't be used */
  override getUserBenefitScore(user: Pokemon, _target: Pokemon, _move: Move): number {
    return user.status && user.status.effect === StatusEffect.SLEEP ? 200 : -10;
  }
}
