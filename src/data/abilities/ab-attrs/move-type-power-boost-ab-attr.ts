import type { ElementalType } from "#enums/elemental-type";
import { MovePowerBoostAbAttr } from "#app/data/abilities/ab-attrs/move-power-boost-ab-attr";

export class MoveTypePowerBoostAbAttr extends MovePowerBoostAbAttr {
  constructor(boostedType: ElementalType, powerMultiplier: number = 1.5) {
    super((pokemon, _defender, move) => !!move && pokemon?.getMoveType(move) === boostedType, powerMultiplier);
  }
}
