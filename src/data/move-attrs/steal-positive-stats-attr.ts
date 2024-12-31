import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { NumberHolder } from "#app/utils";
import i18next from "i18next";
import { StatStageChangeMultiplierAbAttr } from "#app/data/ab-attrs/stat-stage-change-multiplier-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to steal the target's positive stat stages.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Spectral_Thief_(move) | Spectral Thief}.
 * @extends MoveEffectAttr
 */
export class StealPositiveStatsAttr extends MoveEffectAttr {
  constructor() {
    super(false, { trigger: MoveEffectTrigger.PRE_APPLY });
  }

  /** Steals the given target's stat stages and adds them to the user */
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    let statsStolen: boolean = false;
    for (const s of BATTLE_STATS) {
      if (target.getStatStage(s) > 0) {
        const userStatChange = new NumberHolder(target.getStatStage(s));
        applyAbAttrs(StatStageChangeMultiplierAbAttr, user, null, false, userStatChange);
        user.setStatStage(s, user.getStatStage(s) + userStatChange.value);
        target.setStatStage(s, 0);
      }
      user.updateInfo();
      target.updateInfo();
      statsStolen = true;
    }

    if (statsStolen) {
      globalScene.queueMessage(
        i18next.t("moveTriggers:stealPositiveStats", {
          pokemonName: getPokemonNameWithAffix(user),
        }),
      );
    }

    return statsStolen;
  }
}
