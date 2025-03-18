import { DamageProtectedTag } from "#app/data/battler-tags/damage-protected-tag";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";
import { StatusEffect } from "#enums/status-effect";

/**
 * `BattlerTag` class for moves that block damaging moves and burn the enemy if the enemy's move makes contact
 * Used by {@linkcode MoveId.BURNING_BULWARK}
 */
export class ContactBurnProtectedTag extends DamageProtectedTag {
  constructor(sourceMoveId: MoveId) {
    super(sourceMoveId, BattlerTagType.BURNING_BULWARK);
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (!super.apply(pokemon, simulated, attacker, move)) {
      return false;
    }

    if (!simulated && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, null)) {
      attacker.trySetStatus(StatusEffect.BURN, true);
    }
    return true;
  }
}
