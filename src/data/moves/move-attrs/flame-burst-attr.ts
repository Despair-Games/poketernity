import type { BlockNonDirectDamageAbAttr } from "#app/data/abilities/ab-attrs/block-non-direct-damage-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { type Pokemon } from "#app/field/pokemon";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";

/**
 * Applies damage to the target's ally equal to 1/16 of that ally's max HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Flame_Burst_(move) | Flame Burst}.
 * @extends MoveEffectAttr
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
      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, targetAlly, false, cancelled);
    }

    if (cancelled.value || !targetAlly || targetAlly.switchOutStatus) {
      return false;
    }

    targetAlly.damageAndUpdate(toDmgValue((1 / 16) * targetAlly.getMaxHp()), {
      result: HitResult.OTHER,
      ignoreDynamaxReduction: true,
    });
    return true;
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    return target.getAlly() ? -5 : 0;
  }
}
