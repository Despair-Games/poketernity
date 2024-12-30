import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class InvertStatsAttr extends MoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    for (const s of BATTLE_STATS) {
      target.setStatStage(s, -target.getStatStage(s));
    }

    target.updateInfo();
    user.updateInfo();

    globalScene.queueMessage(i18next.t("moveTriggers:invertStats", { pokemonName: getPokemonNameWithAffix(target) }));

    return true;
  }
}
