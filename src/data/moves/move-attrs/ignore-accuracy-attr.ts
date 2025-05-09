import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * Attribute to add an effect that prevents the user from missing
 * its moves for the next 2 turns.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Lock-On_(move) | Lock-On}.
 * @extends AddBattlerTagAttr
 */
export class IgnoreAccuracyAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.IGNORE_ACCURACY, true, { turnCountMin: 2 });
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.applyEffect(user, target, move)) {
      return false;
    }

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:tookAimAtTarget", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}
