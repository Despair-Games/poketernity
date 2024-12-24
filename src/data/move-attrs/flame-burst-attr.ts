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

  /**
   * @param _user - n/a
   * @param target - The target Pokémon.
   * @param _move - n/a
   * @param _args - n/a
   * @returns A boolean indicating whether the effect was successfully applied.
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, _args: any[]): boolean {
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
