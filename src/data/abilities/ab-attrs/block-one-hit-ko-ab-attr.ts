import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Grants immunity to One Hit KO moves.
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Sturdy_(Ability) | Sturdy Ability - Bulbapedia}
 */
export class BlockOneHitKOAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.BLOCK_ONE_HIT_KO);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }
}
