import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

/**
 * Ability attribute that allows the ability holder to be treated as if it has a status effect
 * Used by the ability Comatose
 * @extends AbAttr
 */
export class MockStatusEffectAbAttr extends AbAttr {
  public mockedStatus: StatusEffect;
  constructor(mockedStatus: StatusEffect) {
    super(false);

    this.mockedStatus = mockedStatus;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, statusEffect: NumberHolder): boolean {
    statusEffect.value = this.mockedStatus;
    return true;
  }
}
