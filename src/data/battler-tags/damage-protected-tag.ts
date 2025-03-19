import { ProtectedTag } from "#app/data/battler-tags/protected-tag";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { MoveCategory } from "#enums/move-category";

/**
 * Base class for `BattlerTag`s that block damaging moves but not status moves
 * @extends ProtectedTag
 */
export abstract class DamageProtectedTag extends ProtectedTag {
  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS) {
      return super.apply(pokemon, simulated, attacker, move);
    }
    return false;
  }
}
