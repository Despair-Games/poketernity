import { MovePowerBoostAbAttr } from "#abilities/move-power-boost-ab-attr";
import type { ElementalType } from "#enums/elemental-type";

export class MoveTypePowerBoostAbAttr extends MovePowerBoostAbAttr {
  constructor(boostedType: ElementalType, powerMultiplier: number = 1.5) {
    super((pokemon, _defender, move) => !!move && pokemon?.getMoveType(move) === boostedType, powerMultiplier);
  }
}
