import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BAD_MOVE_PENALTY, MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { type EffectiveStat, getStatKey, Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { EffectiveStatOptions, Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { isBetween } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute used for status moves, namely Speed Swap,
 * that swaps the user's and target's corresponding stats.
 */
export class SwapStatAttr extends MoveEffectAttr {
  /** The stat to be swapped between the user and the target */
  private stat: EffectiveStat;

  constructor(stat: EffectiveStat) {
    super();

    this.stat = stat;
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const temp = user.getStat(this.stat, false);
    user.setStat(this.stat, target.getStat(this.stat, false), false);
    target.setStat(this.stat, temp, false);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:switchedStat", {
        pokemonName: getPokemonNameWithAffix(user),
        stat: i18next.t(getStatKey(this.stat)),
      }),
    );

    return true;
  }

  /**
   * @returns A {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} for each opponent the user
   * would outspeed as a result of applying this attribute's effect on the target. All
   * abilities (including revealed abilities) are ignored for the stat calculations in this scoring.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const effectiveStatOptions: EffectiveStatOptions = {
      abilityApplyMode: AbilityApplyMode.IGNORE,
      simulated: true,
    };

    const startingSpeed = user.getEffectiveStat(Stat.SPD, effectiveStatOptions);
    const projectedSpeed = target.getEffectiveStat(Stat.SPD, effectiveStatOptions);

    if (projectedSpeed <= startingSpeed) {
      return BAD_MOVE_PENALTY;
    }

    const numOpponentsToOutspeed = user
      .getOpponents()
      .filter((opp) =>
        isBetween(opp.getEffectiveStat(Stat.SPD, effectiveStatOptions), startingSpeed, projectedSpeed),
      ).length;

    return numOpponentsToOutspeed * MINOR_EFFECT_SCORE_BONUS;
  }
}
