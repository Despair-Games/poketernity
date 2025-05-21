import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Ability attribute that provides bonus critical hit rate stages to the ability holder
 * It is used by the ability Super Luck, which provides a one stage boost to critical hit rate.
 * @extends AbAttr
 */
export class BonusCritAbAttr extends AbAttr {
  /** Additional critical hit stages provided by the ability. */
  private readonly stages: number;

  constructor(stages: number, showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.BONUS_CRIT);
    this.stages = stages;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, critStage: NumberHolder): boolean {
    critStage.value += this.stages;
    return true;
  }
}
