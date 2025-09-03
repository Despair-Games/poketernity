import { globalScene } from "#app/global-scene";
import type { PendingHealTag } from "#arena-tags/pending-heal-tag";
import {
  ATTACK_SCORE_HP_THRESHOLD,
  BAD_MOVE_PENALTY,
  FAVORABLE_MATCHUP_SCORE_THRESHOLD,
  MINOR_EFFECT_SCORE_BONUS,
} from "#constants/ai-constants";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { SacrificialAttr } from "#moves/sacrificial-attr";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attr used for moves that faint the user but revive a different Pokemon
 *
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Healing_Wish_(move) | Healing Wish}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Lunar_Dance_(move) | Lunar Dance}.
 * @param restorePP - Whether or not PP is restored to the revived Pokemon. Used by Lunar Dance
 * @param moveMessage - The associated key for the move trigger message.
 */
export class SacrificialFullRestoreAttr extends SacrificialAttr {
  protected restorePP: boolean;
  protected moveTriggerMessage: string;

  constructor(restorePP: boolean, moveTriggerMessage: string) {
    super();

    this.restorePP = restorePP;
    this.moveTriggerMessage = moveTriggerMessage;
  }

  public override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    globalScene.arena.addTag(ArenaTagType.PENDING_HEAL, 0);

    const tag = globalScene.arena.findTag<PendingHealTag>(ArenaTagType.PENDING_HEAL);
    tag?.queueHeal(user.getBattlerIndex(), {
      sourceId: user.id,
      moveId: move.id,
      restorePP: this.restorePP,
      healMessageKey: this.moveTriggerMessage,
    });

    return super.applyEffect(user, target, move);
  }

  /**
   * Only works if there is at least 1 unfainted allowed Pokemon in the party and not already in battle
   * @returns the condition function to add to Move objects with this attribute
   */
  public override getCondition(): MoveConditionFunc {
    return (user, _target, _move) =>
      user.getParty().filter((p) => p.isActive()).length > globalScene.currentBattle.getBattlerCount();
  }

  /**
   * @returns An Effect Score modifier as follows:
   * - If the user is a Boss, this grants (-20). Bosses should virtually never
   * use moves with this effect.
   * - If the user has a {@link FAVORABLE_MATCHUP_SCORE_THRESHOLD | favorable matchup}
   * against its opponents, this grants a {@linkcode BAD_MOVE_PENALTY}.
   * - Otherwise, this attribute's Effect Score scales with the damage taken by the
   * most damaged non-fainted Pokemon in the user's party (in terms of % max HP).
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.isBoss()) {
      return -20;
    }

    if (user.getAverageMatchupScore() >= FAVORABLE_MATCHUP_SCORE_THRESHOLD) {
      return BAD_MOVE_PENALTY;
    }

    const possibleHealTargets = user.getParty().filter((p) => !p.isActive(true) && p.isAllowedInBattle());

    const maxHealPercentage = Math.max(...possibleHealTargets.map((p) => p.getInverseHp() / p.getMaxHp()), 0);

    const healScore = Math.floor((maxHealPercentage * 100) / ATTACK_SCORE_HP_THRESHOLD);

    if (healScore === 0) {
      return BAD_MOVE_PENALTY;
    }

    return healScore + (this.restorePP ? MINOR_EFFECT_SCORE_BONUS : 0);
  }
}
