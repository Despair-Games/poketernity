import { ProtectedTag } from "#app/data/battler-tags/protected-tag";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";
import { StatusEffect } from "#enums/status-effect";

export class ContactPoisonProtectedTag extends ProtectedTag {
  constructor(sourceMoveId: MoveId) {
    super(sourceMoveId, BattlerTagType.BANEFUL_BUNKER);
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (!super.apply(pokemon, simulated, attacker, move)) {
      return false;
    }

    if (!simulated && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, null)) {
      attacker.trySetStatus(StatusEffect.POISON, true, pokemon);
    }
    return true;
  }
}
