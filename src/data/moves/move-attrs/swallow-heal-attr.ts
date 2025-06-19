import type { StockpilingTag } from "#battler-tags/stockpiling-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import { HealAttr } from "#moves/heal-attr";
import type { Move } from "#moves/move";

/**
 * Attribute used to apply Swallow's healing, which scales with Stockpile stacks.
 * Does NOT remove stockpiled stacks.
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
