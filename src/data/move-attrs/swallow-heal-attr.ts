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
  protected override getHealRatio(user: Pokemon, _target: Pokemon, _move: Move): number {
    const stockpilingTag = user.getTag(StockpilingTag);

    switch (stockpilingTag?.stockpiledCount) {
      case 1:
        return 0.25;
      case 2:
        return 0.5;
      case 3:
        return 1.0;
      default:
        return 0;
    }
  }
}
