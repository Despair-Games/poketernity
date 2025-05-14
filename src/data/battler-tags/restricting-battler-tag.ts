import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";

/**
 * Interface for battler tags that restrict a {@linkcode Pokemon}'s
 * move selection in some way. Used to extract messages for when
 * the tag interrupts a move's execution or prevents a move's selection
 */
export interface RestrictingBattlerTag {
  getInterruptedText: (pokemon: Pokemon, moveId: MoveId) => string;
  getSelectionDeniedText: (pokemon: Pokemon, moveId: MoveId) => string;
}
