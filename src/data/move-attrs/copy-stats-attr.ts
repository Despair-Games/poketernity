import { BattlerTagType } from "#enums/battler-tag-type";
import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class CopyStatsAttr extends MoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    // Copy all stat stages
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
    globalScene.queueMessage(
      i18next.t("moveTriggers:copiedStatChanges", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}
