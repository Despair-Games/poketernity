import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Ability attribute that allows the ability holder to be treated as if it has a status effect.
 * Used by the ability Comatose
 * @extends AbAttr
 */
export class MockStatusEffectAbAttr extends AbAttr {
  public mockedStatus: StatusEffect;
  constructor(mockedStatus: StatusEffect) {
    super(false);

    this._flags.add(AbAttrFlag.MOCK_STATUS_EFFECT);
    this.mockedStatus = mockedStatus;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, statusEffect: NumberHolder): boolean {
    statusEffect.value = this.mockedStatus;
    return true;
  }
}
