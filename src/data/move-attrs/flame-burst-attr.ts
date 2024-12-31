import { type Pokemon, HitResult } from "#app/field/pokemon";
import { BooleanHolder } from "#app/utils";
import { BlockNonDirectDamageAbAttr } from "#app/data/ab-attrs/block-non-direct-damage-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Applies damage to the target's ally equal to 1/16 of that ally's max HP.
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

  /** If the target has an active ally, damages the ally by 1/16 of its maximum HP */
  override apply(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    const targetAlly = target.getAlly();
    const cancelled = new BooleanHolder(false);

    if (targetAlly) {
      applyAbAttrs(BlockNonDirectDamageAbAttr, targetAlly, cancelled);
    }

    if (cancelled.value || !targetAlly || targetAlly.switchOutStatus) {
      return false;
    }

    targetAlly.damageAndUpdate(Math.max(1, Math.floor((1 / 16) * targetAlly.getMaxHp())), HitResult.OTHER);
    return true;
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    return target.getAlly() ? -5 : 0;
  }
}
