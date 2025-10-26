import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute that provides bonus critical hit rate stages to the ability holder
 * It is used by the ability Super Luck, which provides a one stage boost to critical hit rate.
 */
export class BonusCritAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BonusCritAbAttr";
  /** Additional critical hit stages provided by the ability. */
  private readonly stages: number;

  constructor(stages: number) {
    super();
    this.stages = stages;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, critStage: ValueHolder<number>): void {
    critStage.value += this.stages;
  }
}
