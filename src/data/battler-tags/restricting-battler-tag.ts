import type { Pokemon } from "#app/field/pokemon";
import type { MoveId } from "#enums/move-id";

export interface RestrictingBattlerTag {
  getInterruptedText: (pokemon: Pokemon, moveId: MoveId) => string;
  getSelectionDeniedText: (pokemon: Pokemon, moveId: MoveId) => string;
}
