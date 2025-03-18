import type { Pokemon } from "#app/field/pokemon";
import type { MoveId } from "#enums/move-id";

/**
 * Interface for battler tags that restrict a {@linkcode Pokemon}'s
 * move selection in some way. Used to extract messages for when
 * the tag interrupts a move's execution or prevents a move's selection
 */
export interface RestrictingBattlerTag {
  getInterruptedText: (pokemon: Pokemon, moveId: MoveId) => string;
  getSelectionDeniedText: (pokemon: Pokemon, moveId: MoveId) => string;
}
