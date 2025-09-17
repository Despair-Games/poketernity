/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { StatStageChangePhase } from "#phases/stat-stage-change-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { getAbApplyFunc } from "#abilities/apply-ab-attrs";
import type { ProtectStatAbAttr } from "#abilities/protect-stat-ab-attr";
import type { StatStageChangeMultiplierAbAttr } from "#abilities/stat-stage-change-multiplier-ab-attr";
import { globalScene } from "#app/global-scene";
import type { MistTag } from "#arena-tags/mist-tag";
import { POST_STAT_STAGE_REDUCTION_ABILITIES } from "#constants/ability-constants";
import {
  ACCURACY_REDUCTION_STAGE_LIMIT,
  ALLY_EFFECTIVE_STAT_OPTIONS,
  BAD_MOVE_PENALTY,
  DEFENSE_LOW_INCENTIVE_THRESHOLD,
  EVASION_BOOST_STAGE_LIMIT,
  LOW_ACCURACY_PENALTY_THRESHOLD,
  MAJOR_EFFECT_SCORE_PENALTY,
  MINOR_EFFECT_SCORE_BONUS,
  MINOR_EFFECT_SCORE_PENALTY,
  OPP_EFFECTIVE_STAT_OPTIONS,
  SOFT_EFFECT_SCORE_LIMIT,
} from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import { type BattleStat, Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { ChanceBasedMoveEffectAttr, type ChanceBasedMoveEffectAttrOptions } from "#moves/chance-based-move-effect-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-types";
import { BooleanHolder, clamp, isBetween, NumberHolder } from "#utils/common-utils";

/**
 * Set of optional parameters that may be applied to stat stage changing effects
 * @see {@linkcode StatStageChangeAttr}
 */
interface StatStageChangeAttrOptions extends ChanceBasedMoveEffectAttrOptions {
  /** If defined, needs to be met in order for the stat change to apply */
  condition?: MoveConditionFunc;
  /** `true` to display a message */
  showMessage?: boolean;
}

/**
 * Attribute used for moves that change stat stages
 *
 * @param stats {@linkcode BattleStat} Array of stat(s) to change
 * @param stages How many stages to change the stat(s) by, [-6, 6]
 * @param selfTarget `true` if the move is self-targetting
 * @param options {@linkcode StatStageChangeAttrOptions} Container for any optional parameters for this attribute.
 */
export class StatStageChangeAttr extends ChanceBasedMoveEffectAttr {
  public stats: BattleStat[];
  public stages: number;
  /**
   * Container for optional parameters to this attribute.
   * @see {@linkcode StatStageChangeAttrOptions} for available optional params
   */
  protected override options?: StatStageChangeAttrOptions;

  constructor(stats: BattleStat[], stages: number, selfTarget?: boolean, options?: StatStageChangeAttrOptions) {
    super(selfTarget, options);
    this.stats = stats;
    this.stages = stages;
    this.options = options;
  }

  /**
   * The condition required for the stat stage change to apply.
   * @defaultValue `null` (i.e. no condition required).
   */
  private get condition() {
    return this.options?.condition ?? null;
  }

  /**
   * `true` to display a message for the stat change.
   * @defaultValue `true`
   */
  private get showMessage() {
    return this.options?.showMessage ?? true;
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (this.condition && !this.condition(user, target, move)) {
      return false;
    }

    const stages = this.getLevels(user);
    globalScene.phaseManager.createAndUnshiftPhase(
      "StatStageChangePhase",
      (this.selfTarget ? user : target).getBattlerIndex(),
      user,
      this.stats,
      stages,
      {
        showMessage: this.showMessage,
      },
    );
    return true;
  }

  protected getLevels(_user: Pokemon): number {
    return this.stages;
  }

  public override getEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    return Math.min(super.getEffectScore(user, target, move), SOFT_EFFECT_SCORE_LIMIT);
  }

  /**
   * @returns The combined raw Effect Score for each of this attribute's stats.
   * @see {@linkcode getAllyTargetScoreByStat}
   * @see {@linkcode getOpposingTargetScoreByStat}
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (this.selfTarget) {
      return this.stats.reduce((score, stat) => score + this.getAllyTargetScoreByStat(user, user, move, stat), 0);
    }

    return this.stats.reduce(
      (score, stat) => score + this.getOpposingTargetScoreByStat(user, target as PlayerPokemon, move, stat),
      0,
    );
  }

  /**
   * @returns The combined Effect Score for each of this attribute's stats, {@link getTieredScore | tiered} and
   * upper-bounded by {@linkcode SOFT_EFFECT_SCORE_LIMIT} to yield the final score.
   * @see {@linkcode getAllyTargetScoreByStat}
   */
  public override getAllyTargetScore(user: EnemyPokemon, target: EnemyPokemon, move: Move): number {
    const rawScore = this.stats.reduce(
      (score, stat) => score + this.getAllyTargetScoreByStat(user, target, move, stat),
      0,
    );

    return Math.min(this.getTieredScore(user, target, move, rawScore), SOFT_EFFECT_SCORE_LIMIT);
  }

  /**
   * Calculates the Effect Score gained (before factoring in effect chance) from modifying a single
   * stat stage with this effect on either the user or its ally. The heuristic for this scoring varies based
   * on the stat changed.
   * @param user - The {@linkcode Pokemon} evaluating this effect
   * @param target - The {@linkcode Pokemon} this effect is evaluated against. This can be assumed to be either the
   * user or its ally.
   * @param move - The {@linkcode Move} whose effect is evaluated.
   * @param stat - The {@linkcode BattleStat} being evaluated
   * @returns The "raw" Effect Score bonus (or penalty) for the given stat. This score is combined with other
   * stats and {@link getTieredScore | tiered} to yield the final Effect Score.
   */
  private getAllyTargetScoreByStat(user: EnemyPokemon, target: EnemyPokemon, move: Move, stat: BattleStat): number {
    const levels = this.getAdjustedLevels(user, target, stat);
    if (levels === 0) {
      return move.isStatusMove() ? BAD_MOVE_PENALTY : 0;
    }

    switch (stat) {
      case Stat.ATK:
      case Stat.SPATK:
        return this.getAllyAttackStageChangeScore(target, stat, levels);
      case Stat.DEF:
      case Stat.SPDEF:
        return this.getAllyDefenseStageChangeScore(target, stat, levels);
      case Stat.SPD:
        return this.getAllySpeedStageChangeScore(target, stat, levels);
      case Stat.ACC:
        return this.getAllyAccuracyStageChangeScore(target, stat, levels);
      case Stat.EVA:
        return this.getAllyEvasivenessStageChangeScore(target, stat, levels);
    }
  }

  /**
   * Calculates the raw Effect Score gained from changing the Attack or Sp. Atk stage
   * of an {@linkcode EnemyPokemon} with this attribute's effect. As long as the target
   * Pokemon has a move that matches the stat's corresponding {@linkcode MoveCategory},
   * this grants (+0.5) per stat stage.
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getAllyAttackStageChangeScore(target: EnemyPokemon, stat: Stat.ATK | Stat.SPATK, levels: number): number {
    const category = stat === Stat.ATK ? MoveCategory.PHYSICAL : MoveCategory.SPECIAL;
    const moveset = target.getMoveset().map((mv) => mv.getMove());

    if (moveset.some((mv) => mv.category === category)) {
      return 0.5 * levels;
    }
    return 0;
  }

  /**
   * Calculates the raw Effect Score gained from changing the Defense or Sp. Def stage
   * of an {@linkcode EnemyPokemon} with this attribute's effect. This checks the offensive stat affinities
   * of each opponent (i.e. which is higher between `ATK` and `SPATK`).
   * By default, this grants (+0.5) per stat stage, per opponent with a matching affinity. If the
   * target's stage for the affected stat is at or above the {@linkcode DEFENSE_LOW_INCENTIVE_THRESHOLD},
   * this bonus is halved. For `DEF` boosts, if the target has Body Press, this grants an additional (+1).
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getAllyDefenseStageChangeScore(target: EnemyPokemon, stat: Stat.DEF | Stat.SPDEF, levels: number): number {
    const [relevantStat, otherStat]: BattleStat[] = stat === Stat.DEF ? [Stat.ATK, Stat.SPATK] : [Stat.SPATK, Stat.ATK];

    const scoreMultiplier = target.getStatStage(stat) < DEFENSE_LOW_INCENTIVE_THRESHOLD ? 0.5 : 0.25;

    const numOppsWithMatchingAffinity = target
      .getOpponents()
      .filter(
        (opp) =>
          opp.getEffectiveStat(relevantStat, OPP_EFFECTIVE_STAT_OPTIONS)
          > opp.getEffectiveStat(otherStat, OPP_EFFECTIVE_STAT_OPTIONS),
      ).length;

    const bodyPressBonus = levels > 0 && target.hasMove(MoveId.BODY_PRESS) ? MINOR_EFFECT_SCORE_BONUS : 0;

    return scoreMultiplier * numOppsWithMatchingAffinity * levels + bodyPressBonus;
  }

  /**
   * Calculates the raw Effect Score gained from changing the Speed stage
   * of an {@linkcode EnemyPokemon} with this attribute's effect. This grants
   * (+1) for each opponent the target would surpass in turn order as a result of
   * this effect.
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getAllySpeedStageChangeScore(target: EnemyPokemon, stat: Stat.SPD, levels: number): number {
    if (levels < 0) {
      return MINOR_EFFECT_SCORE_PENALTY;
    }

    const targetStartingSpd = target.getEffectiveStat(stat, ALLY_EFFECTIVE_STAT_OPTIONS);
    const startingSpdStage = target.getStatStage(stat);
    const startingSpdMultiplier = Math.max(2, 2 + startingSpdStage) / Math.max(2, 2 - startingSpdStage);

    const finalSpdStage = startingSpdStage + levels;
    const finalSpdMultiplier = Math.max(2, 2 + finalSpdStage) / Math.max(2, 2 - finalSpdStage);

    const relativeSpdMultiplier = finalSpdMultiplier / startingSpdMultiplier;

    const numOpponentsToOutspeed = target.getOpponents().filter((opp) => {
      const oppSpd = opp.getEffectiveStat(stat, OPP_EFFECTIVE_STAT_OPTIONS);
      return isBetween(oppSpd + 1, targetStartingSpd, targetStartingSpd * relativeSpdMultiplier);
    }).length;

    return numOpponentsToOutspeed * MINOR_EFFECT_SCORE_BONUS;
  }

  /**
   * Calculates the raw Effect Score gained from changing the Accuracy stage of an
   * {@linkcode EnemyPokemon} with this attribute's effect. If the target has a move with
   * base accuracy below the {@linkcode LOW_ACCURACY_PENALTY_THRESHOLD}, this grants
   * (+0.5) per stat stage.
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getAllyAccuracyStageChangeScore(target: EnemyPokemon, _stat: Stat.ACC, levels: number): number {
    if (levels < 0) {
      return MINOR_EFFECT_SCORE_PENALTY;
    }

    const targetHasInaccurateMove = target
      .getMoveset()
      .some((pkmMove) => isBetween(pkmMove.getMove().accuracy, 0, LOW_ACCURACY_PENALTY_THRESHOLD));

    return (targetHasInaccurateMove ? 0.5 : 0) * levels;
  }

  /**
   * Calculates the raw Effect Score gained from changing the Evasiveness stage
   * of an {@linkcode EnemyPokemon} with this attribute's effect. As long as the target's
   * current Evasiveness stat stage is below the {@linkcode EVASION_BOOST_STAGE_LIMIT},
   * this grants (+0.5) per stat stage.
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getAllyEvasivenessStageChangeScore(target: EnemyPokemon, stat: Stat.EVA, levels: number): number {
    if (target.getStatStage(stat) < EVASION_BOOST_STAGE_LIMIT) {
      return 0.5 * levels;
    }
    return 0;
  }

  /**
   * Calculates the Effect Score gained (before factoring in effect chance) from modifying a single
   * stat stage with this effect on one of the user's opponents. The heuristic for this scoring varies based
   * on the stat changed.
   * @param user - The {@linkcode Pokemon} evaluating this effect
   * @param target - The {@linkcode Pokemon} this effect is evaluated against. This can be assumed to be one of
   * the user's opponents.
   * @param move - The {@linkcode Move} whose effect is evaluated
   * @param stat - The {@linkcode BattleStat} being evaluated
   * @returns The "raw" Effect Score bonus (or penalty) for the given stat. This score is combined with other
   * stats and {@link getTieredScore | tiered} to yield the final Effect Score.
   */
  private getOpposingTargetScoreByStat(
    user: EnemyPokemon,
    target: PlayerPokemon,
    move: Move,
    stat: BattleStat,
  ): number {
    const levels = this.getAdjustedLevels(user, target, stat);
    if (levels === 0) {
      return move.isStatusMove() ? BAD_MOVE_PENALTY : 0;
    }

    if (levels < 0 && POST_STAT_STAGE_REDUCTION_ABILITIES.some((abId) => target.hasRevealedAbility(abId))) {
      return MAJOR_EFFECT_SCORE_PENALTY;
    }

    switch (stat) {
      case Stat.ATK:
      case Stat.SPATK:
        return this.getOpponentAttackStageChangeScore(target, stat, levels);
      case Stat.DEF:
      case Stat.SPDEF:
        return this.getOpponentDefenseStageChangeScore(target, stat, levels);
      case Stat.SPD:
        return this.getOpponentSpeedStageChangeScore(target, stat, levels);
      case Stat.ACC:
        return this.getOpponentAccuracyStageChangeScore(target, stat, levels);
      case Stat.EVA:
        return this.getOpponentEvasivenessStageChangeScore(target, stat, levels);
    }
  }

  /**
   * Calculates the raw Effect Score gained from changing the Attack or Sp. Atk stage
   * of a {@linkcode PlayerPokemon} with this attribute's effect. As long as the target
   * Pokemon is expected to have a move that matches the stat's corresponding {@linkcode MoveCategory},
   * this grants (-0.5) per stat stage.
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getOpponentAttackStageChangeScore(
    target: PlayerPokemon,
    stat: Stat.ATK | Stat.SPATK,
    levels: number,
  ): number {
    const category = stat === Stat.ATK ? MoveCategory.PHYSICAL : MoveCategory.SPECIAL;
    const moveset = target.estimateAttackMoves();

    if (moveset.some((mv) => mv.category === category)) {
      return -0.5 * levels;
    }
    return 0;
  }

  /**
   * Calculates the raw Effect Score gained from changing the Defense or Sp. Def stage
   * of a {@linkcode PlayerPokemon} with this attribute's effect. This checks the offensive stat
   * affinities (i.e. which is higher between `ATK` and `SPATK`) of each of the target's
   * opponents (i.e. the user and its ally, if active), and grants (-0.5) per stat stage,
   * per opponent with a matching affinity.
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getOpponentDefenseStageChangeScore(
    target: PlayerPokemon,
    stat: Stat.DEF | Stat.SPDEF,
    levels: number,
  ): number {
    const [relevantStat, otherStat]: BattleStat[] = stat === Stat.DEF ? [Stat.ATK, Stat.SPATK] : [Stat.SPATK, Stat.ATK];

    const numOppsWithMatchingAffinity = target
      .getOpponents()
      .filter(
        (opp) =>
          opp.getEffectiveStat(relevantStat, ALLY_EFFECTIVE_STAT_OPTIONS)
          > opp.getEffectiveStat(otherStat, ALLY_EFFECTIVE_STAT_OPTIONS),
      ).length;

    return -0.5 * numOppsWithMatchingAffinity * levels;
  }

  /**
   * Calculates the raw Effect Score gained from changing the Speed stage
   * of a {@linkcode PlayerPokemon} with this attribute's effect. This grants (+1)
   * for each opposing {@linkcode EnemyPokemon} that would surpass the target
   * in turn order as a result of this effect.
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getOpponentSpeedStageChangeScore(target: PlayerPokemon, stat: Stat.SPD, levels: number): number {
    if (levels > 0) {
      return MINOR_EFFECT_SCORE_PENALTY;
    }

    const targetStartingSpd = target.getEffectiveStat(stat, OPP_EFFECTIVE_STAT_OPTIONS);
    const startingSpdStage = target.getStatStage(stat);
    const startingSpdMultiplier = Math.max(2, 2 + startingSpdStage) / Math.max(2, 2 - startingSpdStage);

    const finalSpdStage = startingSpdStage + levels;
    const finalSpdMultiplier = Math.max(2, 2 + finalSpdStage) / Math.max(2, 2 - finalSpdStage);

    const relativeSpdMultiplier = finalSpdMultiplier / startingSpdMultiplier;

    const numOpponentsToOutspeed = target.getOpponents().filter((opp) => {
      const oppSpd = opp.getEffectiveStat(stat, ALLY_EFFECTIVE_STAT_OPTIONS);
      return isBetween(oppSpd + 1, targetStartingSpd * relativeSpdMultiplier, targetStartingSpd);
    }).length;

    return numOpponentsToOutspeed * MINOR_EFFECT_SCORE_BONUS;
  }

  /**
   * Calculates the raw Effect Score gained from changing the Accuracy stage
   * of a {@linkcode PlayerPokemon} with this attribute's effect. If the target's
   * current Accuracy stat stage is above the {@linkcode ACCURACY_REDUCTION_STAGE_LIMIT},
   * this grants (-0.5) per stat stage.
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getOpponentAccuracyStageChangeScore(target: PlayerPokemon, stat: Stat.ACC, levels: number): number {
    if (target.getStatStage(stat) > ACCURACY_REDUCTION_STAGE_LIMIT) {
      return -0.5 * levels;
    }
    return 0;
  }

  /**
   * Calculates the raw Effect Score gained from changing the Evasiveness stage
   * of a {@linkcode PlayerPokemon} with this attribute's effect. If any of the opposing
   * {@linkcode EnemyPokemon} know a move with base accuracy below the {@linkcode LOW_ACCURACY_PENALTY_THRESHOLD},
   * this grants (-0.5) per stat stage.
   * @param target - The {@linkcode EnemyPokemon} to which the effect may apply
   * @param stat - The {@linkcode Stat} being modified
   * @param levels - The number of stages this attribute's effect will grant to the target
   * @returns The raw Effect Score (can be a decimal value)
   */
  private getOpponentEvasivenessStageChangeScore(target: PlayerPokemon, _stat: Stat.EVA, levels: number): number {
    if (levels > 0) {
      return MINOR_EFFECT_SCORE_PENALTY;
    }

    const oppHasInaccurateMove = target
      .getOpponents()
      .some((opp) =>
        opp.getMoveset().some((pkmMove) => isBetween(pkmMove.getMove().accuracy, 0, LOW_ACCURACY_PENALTY_THRESHOLD)),
      );

    return (oppHasInaccurateMove ? -0.5 : 0) * levels;
  }

  /**
   * Computes the final amount of stat stages changed for the given stat based on
   * the target's known abilities. This accounts for cancelling effects such as
   * Mist and Clear Body, multipliers such as Simple and Contrary, and minimum and
   * maximum total stat stage limits.
   * @param user - The {@linkcode EnemyPokemon} evaluating a move with this effect
   * @param target - The {@linkcode Pokemon} the effect is evaluated against
   * @param stat - The {@linkcode Stat} for which the stages are evaluated
   * @returns The final stat stage change after external effects are accounted for
   *
   * @privateRemarks This is only to be used in Enemy AI Effect Score calculations.
   * @todo Much of this is replicated from {@linkcode StatStageChangePhase}, which
   * should be refactored to make this logic more easily accessible outside of the Phase itself
   */
  private getAdjustedLevels(user: EnemyPokemon, target: Pokemon, stat: BattleStat): number {
    const abApplyFunc = getAbApplyFunc(target.isOpponent(user) ? AbilityApplyMode.REVEALED : AbilityApplyMode.DEFAULT);
    const stages = new NumberHolder(this.getLevels(user));

    if (!this.selfTarget && stages.value < 0) {
      const cancelled = new BooleanHolder(false);
      globalScene.arena.applyTags<MistTag>(ArenaTagType.MIST, target.getArenaTagSide(), true, user, cancelled);

      if (!cancelled.value) {
        abApplyFunc<ProtectStatAbAttr>(AbAttrFlag.PROTECT_STAT, target, true, stat, cancelled);
      }

      if (cancelled.value) {
        return 0;
      }
    }

    abApplyFunc<StatStageChangeMultiplierAbAttr>(AbAttrFlag.STAT_STAGE_CHANGE_MULTIPLIER, target, true, stages);

    const currentStages = target.getStatStage(stat);
    stages.value = clamp(stages.value, -6 - currentStages, 6 - currentStages);
    return stages.value;
  }
}
