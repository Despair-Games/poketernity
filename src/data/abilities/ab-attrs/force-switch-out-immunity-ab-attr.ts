import { AbAttr } from "#abilities/ab-attr";
import type { CancelledAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Ability attribute to grant immunity against effects that would force the
 * source Pokemon to switch out or flee, e.g. Roar, Whirlwind, etc.
 */
// TODO: The activation message when this attribute applies should be implemented internally.
// It being implemented externally (as it is now) prevents the ability flyout from functioning.
export class ForceSwitchOutImmunityAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ForceSwitchOutImmunityAbAttr";

  public override apply({ cancelled }: CancelledAbAttrParams): void {
    cancelled.value = true;
  }
}
