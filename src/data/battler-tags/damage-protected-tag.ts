import { ProtectedTag } from "#battler-tags/protected-tag";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/**
 * Base class for `BattlerTag`s that block damaging moves but not status moves
 */
export abstract class DamageProtectedTag extends ProtectedTag {
  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS) {
      return super.apply(pokemon, simulated, attacker, move);
    }
    return false;
  }
}
