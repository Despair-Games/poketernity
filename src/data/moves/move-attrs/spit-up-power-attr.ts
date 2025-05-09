import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils/common-utils";
import type { StockpilingTag } from "#battler-tags/stockpiling-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";

/**
 * Attribute used to calculate the power of attacks that scale with Stockpile stacks (i.e. Spit Up).
 * @extends VariablePowerAttr
 */
export class SpitUpPowerAttr extends VariablePowerAttr {
  private multiplier: number = 0;

  constructor(multiplier: number) {
    super();
    this.multiplier = multiplier;
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const stockpilingTag = user.getTag<StockpilingTag>(BattlerTagType.STOCKPILING);

    if (stockpilingTag && stockpilingTag.stockpiledCount > 0) {
      power.value = this.multiplier * stockpilingTag.stockpiledCount;
      return true;
    }

    return false;
  }
}
