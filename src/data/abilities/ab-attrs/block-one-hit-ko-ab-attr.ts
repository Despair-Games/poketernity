import { AbAttr } from "#abilities/ab-attr";
import type { CancelledAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Grants immunity to One Hit KO moves.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Sturdy_(Ability) | Sturdy Ability (Bulbapedia)}
 */
export class BlockOneHitKOAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BlockOneHitKOAbAttr";

  public override apply({ cancelled }: CancelledAbAttrParams): void {
    cancelled.value = true;
  }
}
