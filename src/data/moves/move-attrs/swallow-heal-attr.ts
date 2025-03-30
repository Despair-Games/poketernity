import type { StockpilingTag } from "#app/data/battler-tags/stockpiling-tag";
import type { Move } from "#app/data/moves/move";
import { HealAttr } from "#app/data/moves/move-attrs/heal-attr";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Attribute used to apply Swallow's healing, which scales with Stockpile stacks.
 * Does NOT remove stockpiled stacks.
 * @extends HealAttr
 */
export class SwallowHealAttr extends HealAttr {
  protected override getHealRatio(user: Pokemon, _target: Pokemon, _move: Move): number {
    const stockpilingTag = user.getTag<StockpilingTag>(BattlerTagType.STOCKPILING);

    switch (stockpilingTag?.stockpiledCount) {
      case 3:
        return 1.0;
      case 2:
        return 0.5;
      default:
        return 0.25;
    }
  }
}
