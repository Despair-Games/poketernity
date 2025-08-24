import { globalScene } from "#app/global-scene";
import {
  LOW_ACCURACY_PENALTY_THRESHOLD,
  MINOR_EFFECT_SCORE_BONUS,
  MINOR_EFFECT_SCORE_PENALTY,
  SOFT_EFFECT_SCORE_LIMIT,
} from "#constants/ai-constants";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { MoveCategory } from "#enums/move-category";
import { type BattleStat, Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { ChanceBasedMoveEffectAttr, type ChanceBasedMoveEffectAttrOptions } from "#moves/chance-based-move-effect-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-types";
import { isBetween } from "#utils/common-utils";

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

  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    if (this.selfTarget) {
      return this.stats.reduce((score, stat) => score + this.getAllyTargetScoreByStat(user, user, stat), 0);
    }

    return this.stats.reduce((score, stat) => score + this.getOpposingTargetScoreByStat(user, target, stat), 0);
  }

  public override getAllyTargetScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    const rawScore = this.stats.reduce((score, stat) => score + this.getAllyTargetScoreByStat(user, target, stat), 0);

    return Math.min(this.getTieredScore(user, target, move, rawScore), SOFT_EFFECT_SCORE_LIMIT);
  }

  private getAllyTargetScoreByStat(user: EnemyPokemon, target: Pokemon, stat: BattleStat): number {
    const effectiveStatOptions = { simulated: true };
    const oppEffectiveStatOptions = {
      abilityApplyMode: AbilityApplyMode.REVEALED,
      simulated: true,
    };

    switch (stat) {
      case Stat.ATK:
      case Stat.SPATK: {
        const category = stat === Stat.ATK ? MoveCategory.PHYSICAL : MoveCategory.SPECIAL;
        const moveset = target.getMoveset().map((mv) => mv.getMove());

        if (moveset.some((mv) => mv.category === category)) {
          return 0.5 * this.getLevels(user);
        }
        return 0;
      }
      case Stat.DEF:
      case Stat.SPDEF: {
        const [relevantStat, otherStat]: BattleStat[] =
          stat === Stat.DEF ? [Stat.ATK, Stat.SPATK] : [Stat.SPATK, Stat.ATK];

        const numOppsWithMatchingAffinity = target
          .getOpponents()
          .filter(
            (opp) =>
              opp.getEffectiveStat(relevantStat, oppEffectiveStatOptions)
              > opp.getEffectiveStat(otherStat, oppEffectiveStatOptions),
          ).length;

        return 0.5 * numOppsWithMatchingAffinity * this.getLevels(user);
      }
      case Stat.SPD: {
        if (this.getLevels(user) < 0) {
          return MINOR_EFFECT_SCORE_PENALTY;
        }

        const targetStartingSpd = target.getEffectiveStat(stat, effectiveStatOptions);
        const startingSpdStage = target.getStatStage(stat);
        const startingSpdMultiplier = Math.max(2, 2 + startingSpdStage) / Math.max(2, 2 - startingSpdStage);

        const finalSpdStage = startingSpdStage + this.getLevels(user);
        const finalSpdMultiplier = Math.max(2, 2 + finalSpdStage) / Math.max(2, 2 - finalSpdStage);

        const relativeSpdMultiplier = finalSpdMultiplier / startingSpdMultiplier;

        const numOpponentsToOutspeed = target.getOpponents().filter((opp) => {
          const oppSpd = opp.getEffectiveStat(stat, oppEffectiveStatOptions);
          return isBetween(oppSpd + 1, targetStartingSpd, targetStartingSpd * relativeSpdMultiplier);
        }).length;

        return numOpponentsToOutspeed * MINOR_EFFECT_SCORE_BONUS;
      }
      case Stat.ACC: {
        if (this.getLevels(user) < 0) {
          return MINOR_EFFECT_SCORE_PENALTY;
        }

        const targetHasInaccurateMove = target
          .getMoveset()
          .some((pkmMove) => pkmMove.getMove().accuracy < LOW_ACCURACY_PENALTY_THRESHOLD);

        return (targetHasInaccurateMove ? 0.5 : 0) * this.getLevels(user);
      }
      case Stat.EVA:
        return 0.5 * this.getLevels(user);
    }
  }

  private getOpposingTargetScoreByStat(user: EnemyPokemon, target: Pokemon, stat: BattleStat): number {
    const effectiveStatOptions = {
      abilityApplyMode: AbilityApplyMode.REVEALED,
      simulated: true,
    };
    const oppEffectiveStatOptions = { simulated: true };

    switch (stat) {
      case Stat.ATK:
      case Stat.SPATK: {
        const category = stat === Stat.ATK ? MoveCategory.PHYSICAL : MoveCategory.SPECIAL;
        const moveset = target.estimateAttackMoves();

        if (moveset.some((mv) => mv.category === category)) {
          return -0.5 * this.getLevels(user);
        }
        return 0;
      }
      case Stat.DEF:
      case Stat.SPDEF: {
        const [relevantStat, otherStat]: BattleStat[] =
          stat === Stat.DEF ? [Stat.ATK, Stat.SPATK] : [Stat.SPATK, Stat.ATK];

        const numOppsWithMatchingAffinity = target
          .getOpponents()
          .filter(
            (opp) =>
              opp.getEffectiveStat(relevantStat, oppEffectiveStatOptions)
              > opp.getEffectiveStat(otherStat, oppEffectiveStatOptions),
          ).length;

        return -0.5 * numOppsWithMatchingAffinity * this.getLevels(user);
      }
      case Stat.SPD: {
        if (this.getLevels(user) > 0) {
          return MINOR_EFFECT_SCORE_PENALTY;
        }

        const targetStartingSpd = target.getEffectiveStat(stat, effectiveStatOptions);
        const startingSpdStage = target.getStatStage(stat);
        const startingSpdMultiplier = Math.max(2, 2 + startingSpdStage) / Math.max(2, 2 - startingSpdStage);

        const finalSpdStage = startingSpdStage + this.getLevels(user);
        const finalSpdMultiplier = Math.max(2, 2 + finalSpdStage) / Math.max(2, 2 - finalSpdStage);

        const relativeSpdMultiplier = finalSpdMultiplier / startingSpdMultiplier;

        const numOpponentsToOutspeed = target.getOpponents().filter((opp) => {
          const oppSpd = opp.getEffectiveStat(stat, oppEffectiveStatOptions);
          return isBetween(oppSpd + 1, targetStartingSpd * relativeSpdMultiplier, targetStartingSpd);
        }).length;

        return numOpponentsToOutspeed * MINOR_EFFECT_SCORE_BONUS;
      }
      case Stat.ACC:
        return -0.5 * this.getLevels(user);
      case Stat.EVA: {
        if (this.getLevels(user) > 0) {
          return MINOR_EFFECT_SCORE_PENALTY;
        }

        const oppHasInaccurateMove = target
          .getOpponents()
          .some((opp) =>
            opp.getMoveset().some((pkmMove) => pkmMove.getMove().accuracy < LOW_ACCURACY_PENALTY_THRESHOLD),
          );

        return (oppHasInaccurateMove ? -0.5 : 0) * this.getLevels(user);
      }
    }
  }
}
