import { CommonBattleAnim } from "#app/data/animations/common-battle-anim";
import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveFlags } from "#enums/move-flags";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag to protect the owner from most incoming moves for the rest of the turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Protect_(move) | Protect} and related moves.
 * @extends BattlerTag
 */
export class ProtectedTag extends BattlerTag {
  constructor(sourceMoveId: MoveId, tagType: BattlerTagType = BattlerTagType.PROTECTED) {
    super(tagType, BattlerTagLapseType.TURN_END, 0, sourceMoveId);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:protectedOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (move.checkFlag(MoveFlags.IGNORE_PROTECT, attacker, pokemon)) {
      return false;
    }

    if (!simulated) {
      new CommonBattleAnim(CommonAnim.PROTECT, pokemon).play();
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:protectedLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
    }
    return true;
  }
}
