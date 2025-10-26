import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute to grant immunity against effects that would force the
 * source Pokemon to switch out or flee, e.g. Roar, Whirlwind, etc.
 * @todo The activation message when this attribute applies should be implemented
 * internally. It being implemented externally (as it is now) prevents the ability flyout
 * from functioning.
 */
export class ForceSwitchOutImmunityAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ForceSwitchOutImmunityAbAttr";

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }
}
