import type { Type } from "#enums/type";
import { ReceivedMoveDamageMultiplierAbAttr } from "./received-move-damage-multiplier-ab-attr";

export class ReceivedTypeDamageMultiplierAbAttr extends ReceivedMoveDamageMultiplierAbAttr {
  constructor(moveType: Type, damageMultiplier: number) {
    super((_target, user, move) => user.getMoveType(move) === moveType, damageMultiplier);
  }
}
