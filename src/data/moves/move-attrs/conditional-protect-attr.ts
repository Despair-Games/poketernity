import { globalScene } from "#app/global-scene";
import { CraftyShieldConditionFunc } from "#arena-tags/crafty-shield-tag";
import { MatBlockConditionFunc } from "#arena-tags/mat-block-tag";
import { QuickGuardConditionFunc } from "#arena-tags/quick-guard-tag";
import { WideGuardConditionFunc } from "#arena-tags/wide-guard-tag";
import { MAJOR_EFFECT_SCORE_BONUS, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { AddArenaTagAttr } from "#moves/move-attrs/add-arena-tag-attr";
import type { ProtectConditionFunc } from "#types/protect-condition-func";

/**
 * Attribute to apply team-wide protection against certain moves
 * for a turn. Incoming moves are negated if they meet the effect's
 * associated {@linkcode ProtectConditionFunc | condition}.
 * @extends AddArenaTagAttr
 */
export class ConditionalProtectAttr extends AddArenaTagAttr {
  constructor(tagType: ArenaTagType) {
    super(tagType, ArenaTagRelativeSide.USER, { turnCount: 1, failOnOverlap: true });
  }

  /**
   * Grants an Effect Score bonus as follows:
   * - In single battles, no bonus is given (+0).
   * - Otherwise, if the move is Crafty Shield, grants 30%(+1).
   * - Otherwise, grants a {@link MAJOR_EFFECT_SCORE_BONUS | major bonus} for each
   * opponent with a threatening attack that can be blocked by the move's effect.
   *
   * The total bonus from this effect cannot exceed (+3).
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    // Effect score is only given to conditional protection moves in double battles
    if (!globalScene.currentBattle.double) {
      return 0;
    }

    /**
     * Since the following logic only checks for attacks, it's not
     * compatible with Crafty Shield's protect condition. Instead,
     * Crafty Shield is given a 30%(+1) bonus in double battles
     */
    if (this.tagType === ArenaTagType.CRAFTY_SHIELD) {
      return this.getRandomScore(user, 30);
    }

    const rawScore = user
      .getOpponents()
      .map((opp) => this.getOpponentEffectRelevanceScore(user, opp))
      .reduce((total, score) => total + score, 0);

    return Math.min(rawScore, SOFT_EFFECT_SCORE_LIMIT);
  }

  /**
   * Calculates the Effect Score bonus gained based on whether an opposing
   * Pokemon is likely to use an attack that matches protection conditions
   * @param user the {@linkcode EnemyPokemon} that may select a move with this attribute
   * @param opponent the opposing {@linkcode Pokemon} to evaluate against
   * @returns (+2) if a relevant threatening attack is found; (+0) otherwise
   */
  private getOpponentEffectRelevanceScore(user: EnemyPokemon, opponent: Pokemon): number {
    const protectCondition = this.getProtectCondition();

    /**
     * All moves revealed by the opponent that have a moderate AS or better against
     * at least one ally (i.e. they deal ~40% max HP damage or more)
     */
    const oppKnownThreatMoves = opponent
      .getMoveset()
      .filter(
        (mv) =>
          opponent.waveData.revealedMoves.has(mv.moveId)
          && user.getField().some((ally) => opponent.getExpectedAttackScore(ally, mv.getMove()) >= 2),
      );

    if (oppKnownThreatMoves.some((mv) => protectCondition(mv.moveId))) {
      return MAJOR_EFFECT_SCORE_BONUS;
    }
    return 0;
  }

  private getProtectCondition(): ProtectConditionFunc {
    switch (this.tagType) {
      case ArenaTagType.WIDE_GUARD:
        return WideGuardConditionFunc;
      case ArenaTagType.QUICK_GUARD:
        return QuickGuardConditionFunc;
      case ArenaTagType.MAT_BLOCK:
        return MatBlockConditionFunc;
      case ArenaTagType.CRAFTY_SHIELD:
        return CraftyShieldConditionFunc;
      default:
        console.warn(`${this.constructor.name}: Unsupported tag type ${ArenaTagType[this.tagType]} detected!`);
        return (_moveId) => true;
    }
  }
}
