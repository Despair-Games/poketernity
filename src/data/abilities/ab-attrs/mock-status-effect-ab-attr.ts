import { AbAttr } from "#abilities/ab-attr";
import type { StatusEffect } from "#enums/status-effect";
import type { MockStatusEffectAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Ability attribute that allows the ability holder to be treated as if it has a status effect.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Comatose_(Ability)}
 */
export class MockStatusEffectAbAttr extends AbAttr {
  protected override readonly abAttrKey = "MockStatusEffectAbAttr";

  private readonly mockedStatus: StatusEffect;

  constructor(mockedStatus: StatusEffect) {
    super();

    this.mockedStatus = mockedStatus;
  }

  public override apply({ statusEffect }: MockStatusEffectAbAttrParams): void {
    statusEffect.value = this.mockedStatus;
  }
}
