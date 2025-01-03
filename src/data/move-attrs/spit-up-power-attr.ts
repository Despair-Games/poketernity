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

  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const stockpilingTag = user.getTag(StockpilingTag);

    if (stockpilingTag && stockpilingTag.stockpiledCount > 0) {
      const power = args[0] as NumberHolder;
      power.value = this.multiplier * stockpilingTag.stockpiledCount;
      return true;
    }

    return false;
  }
}
