import { BattlerTagType } from "#enums/battler-tag-type";
import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

/**
 * Attribute to copy the target's stat stages onto the user.
 * This also copies critical hit stages from Focus Energy or Lansat Berries.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Psych_Up_(move) | Psych Up}.
 * @extends MoveEffectAttr
 */
export class CopyStatsAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    for (const s of BATTLE_STATS) {
      user.setStatStage(s, target.getStatStage(s));
    }

    if (target.getTag(BattlerTagType.CRIT_BOOST)) {
      user.addTag(BattlerTagType.CRIT_BOOST, 0, move.id);
    } else {
      user.removeTag(BattlerTagType.CRIT_BOOST);
    }
    target.updateInfo();
    user.updateInfo();
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:copiedStatChanges", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}
