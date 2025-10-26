import { AbAttr } from "#abilities/ab-attr";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute that allows the ability holder to be treated as if it has a status effect.
 * Used by the ability Comatose
 */
export class MockStatusEffectAbAttr extends AbAttr {
  protected override readonly abAttrKey = "MockStatusEffectAbAttr";
  private readonly mockedStatus: StatusEffect;

  constructor(mockedStatus: StatusEffect) {
    super();

    this.mockedStatus = mockedStatus;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, statusEffect: ValueHolder<number>): void {
    statusEffect.value = this.mockedStatus;
  }
}
