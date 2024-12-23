import type { Type } from "#enums/type";
import { MovePowerBoostAbAttr } from "./move-power-boost-ab-attr";

export class MoveTypePowerBoostAbAttr extends MovePowerBoostAbAttr {
  constructor(boostedType: Type, powerMultiplier: number = 1.5) {
    super((pokemon, _defender, move) => pokemon?.getMoveType(move) === boostedType, powerMultiplier);
  }
}
