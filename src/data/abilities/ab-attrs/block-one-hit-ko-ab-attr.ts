import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Grants immunity to One Hit KO moves.
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Sturdy_(Ability) | Sturdy Ability - Bulbapedia}
 */
export class BlockOneHitKOAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BlockOneHitKOAbAttr";

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }
}
