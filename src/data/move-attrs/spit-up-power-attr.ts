import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { StockpilingTag } from "#app/data/battler-tags";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

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

  /** Sets the given move's power according to the user's stockpiled count */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const stockpilingTag = user.getTag(StockpilingTag);

    if (stockpilingTag && stockpilingTag.stockpiledCount > 0) {
      power.value = this.multiplier * stockpilingTag.stockpiledCount;
      return true;
    }

    return false;
  }
}
