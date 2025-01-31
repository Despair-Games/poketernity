import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class BlockNonDirectDamageAbAttr extends AbAttr {
  constructor() {
    super();
    this._id = AbAttrId.BLOCK_NON_DIRECT_DAMAGE;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;
    return true;
  }
}
