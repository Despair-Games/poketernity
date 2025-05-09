import type { ElementalType } from "#enums/elemental-type";
import { ReceivedMoveDamageMultiplierAbAttr } from "#app/data/abilities/ab-attrs/received-move-damage-multiplier-ab-attr";

export class ReceivedTypeDamageMultiplierAbAttr extends ReceivedMoveDamageMultiplierAbAttr {
  constructor(moveType: ElementalType, damageMultiplier: number) {
    super((_target, user, move) => user.getMoveType(move) === moveType, damageMultiplier);
  }
}
