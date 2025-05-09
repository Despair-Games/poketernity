import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { StatStageChangeMultiplierAbAttr } from "#abilities/stat-stage-change-multiplier-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { NumberHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to steal the target's positive stat stages.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Spectral_Thief_(move) | Spectral Thief}.
 * @extends MoveEffectAttr
 */
export class StealPositiveStatsAttr extends MoveEffectAttr {
  constructor() {
    super(false, { trigger: MoveEffectTrigger.PRE_APPLY });
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    let statsStolen: boolean = false;
    for (const s of BATTLE_STATS) {
      if (target.getStatStage(s) > 0) {
        const userStatChange = new NumberHolder(target.getStatStage(s));
        applyAbAttrs<StatStageChangeMultiplierAbAttr>(
          AbAttrFlag.STAT_STAGE_CHANGE_MULTIPLIER,
          user,
          false,
          userStatChange,
        );
        user.setStatStage(s, user.getStatStage(s) + userStatChange.value);
        target.setStatStage(s, 0);
      }
      user.updateInfo();
      target.updateInfo();
      statsStolen = true;
    }

    if (statsStolen) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("moveTriggers:stealPositiveStats", {
          pokemonName: getPokemonNameWithAffix(user),
        }),
      );
    }

    return statsStolen;
  }
}
