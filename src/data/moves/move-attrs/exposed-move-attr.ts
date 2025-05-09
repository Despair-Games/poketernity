import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * Drops the target's immunity to types it is immune to
 * and makes its evasiveness be ignored during accuracy
 * checks.
 * Used by: {@linkcode MoveId.ODOR_SLEUTH | Odor Sleuth}, {@linkcode MoveId.MIRACLE_EYE | Miracle Eye} and {@linkcode MoveId.FORESIGHT | Foresight}
 * @extends AddBattlerTagAttr
 */
export class ExposedMoveAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType) {
    super(tagType, false, { failOnOverlap: true });
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.applyEffect(user, target, move)) {
      return false;
    }

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:exposedMove", {
        pokemonName: getPokemonNameWithAffix(user),
        targetPokemonName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}
