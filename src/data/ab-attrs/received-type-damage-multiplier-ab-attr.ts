import type { ElementType } from "#enums/element-type";
import { ReceivedMoveDamageMultiplierAbAttr } from "./received-move-damage-multiplier-ab-attr";

export class ReceivedTypeDamageMultiplierAbAttr extends ReceivedMoveDamageMultiplierAbAttr {
  constructor(moveType: ElementType, damageMultiplier: number) {
    super((_target, user, move) => user.getMoveType(move) === moveType, damageMultiplier);
  }
}
