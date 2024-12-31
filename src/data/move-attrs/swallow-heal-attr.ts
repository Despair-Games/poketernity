import type { Pokemon } from "#app/field/pokemon";
import { StockpilingTag } from "#app/data/battler-tags";
import type { Move } from "#app/data/move";
import { HealAttr } from "#app/data/move-attrs/heal-attr";

/**
 * Attribute used to apply Swallow's healing, which scales with Stockpile stacks.
 * Does NOT remove stockpiled stacks.
 * @extends HealAttr
 */
export class SwallowHealAttr extends HealAttr {
  /** Restores health to the user based on the user's stockpiled count */
  override apply(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const stockpilingTag = user.getTag(StockpilingTag);

    if (stockpilingTag && stockpilingTag.stockpiledCount > 0) {
      const stockpiled = stockpilingTag.stockpiledCount;
      let healRatio: number;

      if (stockpiled === 1) {
        healRatio = 0.25;
      } else if (stockpiled === 2) {
        healRatio = 0.5;
      } else {
        // stockpiled >= 3
        healRatio = 1.0;
      }

      if (healRatio) {
        this.addHealPhase(user, healRatio);
        return true;
      }
    }

    return false;
  }
}
