import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class MaxMultiHitAbAttr extends AbAttr {
  constructor() {
    super();
    this._id = AbAttrId.MAX_MULTI_HIT;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, hitValue: NumberHolder): boolean {
    hitValue.value = 0;

    return true;
  }
}
