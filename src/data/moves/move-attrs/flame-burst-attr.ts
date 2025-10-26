import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { HitResult } from "#enums/hit-result";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";

/**
 * Applies damage to the target's ally equal to 1/16 of that ally's max HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Flame_Burst_(move) | Flame Burst}.
 */
export class FlameBurstAttr extends MoveEffectAttr {
  constructor() {
    /**
     * This is self-targeted to bypass immunity to target-facing secondary
     * effects when the target has an active Substitute doll.
     * TODO: Find a more intuitive way to implement Substitute bypassing.
     */
    super(true);
  }

  override applyEffect(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    const targetAlly = target.getAlly();
    const cancelled = new BooleanHolder(false);

    if (targetAlly) {
      applyAbAttrs("BlockNonDirectDamageAbAttr", targetAlly, false, cancelled);
    }

    if (cancelled.value || !targetAlly || targetAlly.switchOutStatus) {
      return false;
    }

    targetAlly.damageAndUpdate(toDmgValue((1 / 16) * targetAlly.getMaxHp()), {
      result: HitResult.OTHER,
    });
    return true;
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    return target.getAlly() ? -5 : 0;
  }
}
