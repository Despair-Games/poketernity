import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { StatStageChangeMultiplierAbAttr } from "#abilities/stat-stage-change-multiplier-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { BATTLE_STATS, type BattleStat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { clamp, NumberHolder, ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to steal the target's positive stat stages.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Spectral_Thief_(move) | Spectral Thief}.
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
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("moveTriggers:stealPositiveStats", {
          pokemonName: getPokemonNameWithAffix(user),
        }),
      );
    }

    return statsStolen;
  }

  /**
   * @returns A {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} for each stat stage the user would gain
   * from this effect against the given target. The projected stat stage gain accounts for
   * stat stage multipliers such as Simple and Contrary.
   *
   * @remarks
   * Unlike other large Effect Score modifiers, this effect's score is uncapped, so the AI
   * should prefer moves with this effect over KO moves in extreme cases.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const totalStatGain = BATTLE_STATS.reduce((total, stat) => total + this.getAdjustedStatGain(user, target, stat), 0);

    return totalStatGain * MINOR_EFFECT_SCORE_BONUS;
  }

  /**
   * Calculates how many stages of a single stat the user would gain from applying this attribute's
   * effect to the target. This accounts for the user's stat stage limits as well as stat stage change
   * multipliers from the user's Simple or Contrary.
   * @param user - The {@linkcode EnemyPokemon} evaluating the effect
   * @param target - The {@linkcode Pokemon} the effect is evaluated against
   * @param stat - The {@linkcode BattleStat} whose gain is evaluated
   * @returns The number of stages the user would gain in the given stat when applying this effect
   * against the given target.
   */
  private getAdjustedStatGain(user: EnemyPokemon, target: Pokemon, stat: BattleStat): number {
    const statGain = new ValueHolder(Math.max(target.getStatStage(stat), 0));
    applyAbAttrs<StatStageChangeMultiplierAbAttr>(AbAttrFlag.STAT_STAGE_CHANGE_MULTIPLIER, user, true, statGain);

    const currentStage = user.getStatStage(stat);
    return clamp(statGain.value, -6 - currentStage, 6 - currentStage);
  }
}
