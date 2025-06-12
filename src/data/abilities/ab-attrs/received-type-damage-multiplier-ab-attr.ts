import { ReceivedMoveDamageMultiplierAbAttr } from "#abilities/received-move-damage-multiplier-ab-attr";
import type { ElementalType } from "#enums/elemental-type";

/**
 * Adds a damage multiplier when the ability holder is hit
 * by a move of a specific {@linkcode ElementalType | type}.
 *
 * ```
 * +----------------+------------------+----------+
 * | Ability        | Multiplier       | Type     |
 * +----------------+------------------+----------+
 * | Dry Skin       | 1.25 (+25%)      | Water    |
 * +----------------+------------------+----------+
 * | Thick Fat      | 1.50 (+50%)      | Fire     |
 * +----------------+------------------+----------+
 * | Heatproof      | 1.50 (+50%)      | Fire     |
 * +----------------+------------------+----------+
 * | Water Bubble   | 1.50 (+50%)      | Fire     |
 * +----------------+------------------+----------+
 * | Fluffy         | 2.00 (+100%)     | Fire     |
 * +----------------+------------------+----------+
 * | Purifying Salt | 1.50 (+25%)      | Ghost    |
 * +----------------+------------------+----------+
 * ```
 *
 * @extends ReceivedMoveDamageMultiplierAbAttr
 */
export class ReceivedTypeDamageMultiplierAbAttr extends ReceivedMoveDamageMultiplierAbAttr {
  constructor(moveType: ElementalType, damageMultiplier: number) {
    super((_target, user, move) => user.getMoveType(move) === moveType, damageMultiplier);
  }
}
