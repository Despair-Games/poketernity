import { DamageProtectedTag } from "#battler-tags/damage-protected-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/**
 * Tag used to block damaging moves and poison the attacker if the move makes contact.
 * Used by {@linkcode MoveId.BANEFUL_BUNKER}
 * @extends DamageProtectedTag
 */
export class ContactPoisonProtectedTag extends DamageProtectedTag {
  constructor(sourceMoveId: MoveId) {
    super(sourceMoveId, BattlerTagType.BANEFUL_BUNKER);
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (!super.apply(pokemon, simulated, attacker, move)) {
      return false;
    }

    if (!simulated && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker)) {
      attacker.trySetStatus(StatusEffect.POISON, true, pokemon);
    }
    return true;
  }
}
