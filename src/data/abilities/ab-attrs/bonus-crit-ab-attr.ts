import { AbAttr } from "#abilities/ab-attr";
import type { BonusCritAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Ability attribute that provides bonus critical hit rate stages to the ability holder.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Super_Luck_(Ability) | Super Luck (Bulbapedia)}
 */
export class BonusCritAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BonusCritAbAttr";

  /** Additional critical hit stages provided by the ability. */
  private readonly stages: number;

  constructor(stages: number) {
    super();
    this.stages = stages;
  }

  public override apply({ critStage }: BonusCritAbAttrParams): void {
    critStage.value += this.stages;
  }
}
