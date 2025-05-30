import { ReceivedMoveDamageMultiplierAbAttr } from "#abilities/received-move-damage-multiplier-ab-attr";
import type { ElementalType } from "#enums/elemental-type";

/**
 * Adds a damage multiplier for a specific {@linkcode ElementalType}
 * when the ability holder is hit by a move of that type.
 *
 * ```
 * +-----------+------------------+
 * |  Ability  |    Multiplier    |
 * +-----------+------------------+
 * | Dry Skin  |   1.25 (+25%)    |
 * +-----------+------------------+
 * ```
 *
 * @extends ReceivedMoveDamageMultiplierAbAttr
 */
export class ReceivedTypeDamageMultiplierAbAttr extends ReceivedMoveDamageMultiplierAbAttr {
  constructor(moveType: ElementalType, damageMultiplier: number) {
    super((_target, user, move) => user.getMoveType(move) === moveType, damageMultiplier);
  }
}
