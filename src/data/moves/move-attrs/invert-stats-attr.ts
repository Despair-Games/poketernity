import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

/**
 * Attribute to invert the target's stat stages.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Topsy-Turvy_(move) | Topsy-Turvy}.
 * @extends MoveEffectAttr
 */
export class InvertStatsAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    for (const s of BATTLE_STATS) {
      target.setStatStage(s, -target.getStatStage(s));
    }

    target.updateInfo();
    user.updateInfo();

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:invertStats", { pokemonName: getPokemonNameWithAffix(target) }),
    );

    return true;
  }
}
