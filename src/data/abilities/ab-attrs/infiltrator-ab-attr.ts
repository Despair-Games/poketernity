import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Infiltrator_(Ability) | Infiltrator}.
 * Allows the source's moves to bypass the effects of opposing Light Screen, Reflect, Aurora Veil, Safeguard, Mist, and Substitute.
 */
export class InfiltratorAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.INFILTRATOR);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, bypassed: ValueHolder<boolean>): void {
    bypassed.value = true;
  }
}
