import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import {
  ALLY_EFFECTIVE_STAT_OPTIONS,
  BAD_MOVE_PENALTY,
  MAJOR_EFFECT_SCORE_BONUS,
  MINOR_EFFECT_SCORE_BONUS,
  OPP_EFFECTIVE_STAT_OPTIONS,
} from "#constants/ai-constants";
import { type EffectiveStat, getStatKey, Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
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
  private readonly stat: EffectiveStat;

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
   * would outspeed as a result of applying this attribute's effect on the target.
   *
   * @privateRemarks
   * This scoring is specific to Speed Swap. It may need to be generalized if other moves with
   * this attribute are implemented.
   */
  public override getEffectScore(user: EnemyPokemon, target: PlayerPokemon, _move: Move): number {
    const [userProjSpeed, targetProjSpeed] = this.getProjectedSpeeds(user, target);

    if (userProjSpeed <= targetProjSpeed) {
      return BAD_MOVE_PENALTY;
    }

    const targetAlly = target.getAlly();
    if (
      targetAlly?.isActive(true)
      && isBetween(
        targetAlly.getEffectiveStat(Stat.SPD, OPP_EFFECTIVE_STAT_OPTIONS),
        user.getEffectiveStat(Stat.SPD),
        userProjSpeed,
      )
    ) {
      return MAJOR_EFFECT_SCORE_BONUS;
    }
    return MINOR_EFFECT_SCORE_BONUS;
  }

  /**
   * Calculates the projected speeds of the given user and target after applying
   * this attribute's effect.
   * @param user - The {@linkcode EnemyPokemon} evaluating the effect
   * @param target - The {@linkcode Pokemon} the effect is evaluated against
   * @returns A tuple in the format `[userProjSpeed, targetProjSpeed]` of each Pokemon's
   * predicted Speed after applying this effect
   * @todo Abilities' effects are applied to the wrong Pokemon in these stat calculations
   */
  private getProjectedSpeeds(user: EnemyPokemon, target: PlayerPokemon): [number, number] {
    const userProjSpeed =
      (target.getEffectiveStat(Stat.SPD, OPP_EFFECTIVE_STAT_OPTIONS) * user.getStatStageMultiplier(Stat.SPD))
      / target.getStatStageMultiplier(Stat.SPD);
    const targetProjSpeed =
      (user.getEffectiveStat(Stat.SPD, ALLY_EFFECTIVE_STAT_OPTIONS) * target.getStatStageMultiplier(Stat.SPD))
      / user.getStatStageMultiplier(Stat.SPD);

    return [userProjSpeed, targetProjSpeed];
  }
}
