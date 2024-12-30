import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";
import type { Move } from "../move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

/**
 * Drops the target's immunity to types it is immune to
 * and makes its evasiveness be ignored during accuracy
 * checks. Used by: {@linkcode Moves.ODOR_SLEUTH | Odor Sleuth}, {@linkcode Moves.MIRACLE_EYE | Miracle Eye} and {@linkcode Moves.FORESIGHT | Foresight}
 *
 * @extends AddBattlerTagAttr
 * @see {@linkcode apply}
 */
export class ExposedMoveAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType) {
    super(tagType, false, { failOnOverlap: true });
  }

  /**
   * Applies {@linkcode ExposedTag} to the target.
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param args N/A
   * @returns `true` if the function succeeds
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    globalScene.queueMessage(
      i18next.t("moveTriggers:exposedMove", {
        pokemonName: getPokemonNameWithAffix(user),
        targetPokemonName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}
