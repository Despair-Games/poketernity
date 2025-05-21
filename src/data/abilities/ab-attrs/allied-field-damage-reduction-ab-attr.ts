import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Reduces the damage dealt to an allied Pokemon. Used by Friend Guard.
 * @extends PreDefendAbAttr
 */
export class AlliedFieldDamageReductionAbAttr extends PreDefendAbAttr {
  private readonly damageMultiplier: number;

  constructor(damageMultiplier: number) {
    super();
    this._flags.add(AbAttrFlag.ALLIED_FIELD_DAMAGE_REDUCTION);
    this.damageMultiplier = damageMultiplier;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    multiplier: NumberHolder,
  ): boolean {
    multiplier.value *= this.damageMultiplier;
    return true;
  }
}
