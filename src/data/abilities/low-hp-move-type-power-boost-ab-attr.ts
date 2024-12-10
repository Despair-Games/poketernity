import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type { Type } from "#enums/type";
import { MoveTypePowerBoostAbAttr } from "./move-type-power-boost-ab-attr";

export class LowHpMoveTypePowerBoostAbAttr extends MoveTypePowerBoostAbAttr {
  constructor(boostedType: Type) {
    super(boostedType);
  }

  override getCondition(): AbAttrCondition {
    return (pokemon) => pokemon.getHpRatio() <= 0.33;
  }
}
