import { BAD_MOVE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveCondition } from "#moves/move-condition";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";

/**
 * Condition for the move {@link https://bulbapedia.bulbagarden.net/wiki/Focus_Punch_(move) | Focus Punch}.
 * Requires the user to not have received attack damage the turn the move is used.
 * @extends MoveCondition
 */
export class FocusPunchCondition extends MoveCondition {
  constructor() {
    super(focusPunchCondition);
  }

  /**
   * Grants a Condition Score as follows:
   * - If the user is behind a substitute, this grants no penalty.
   * - If all opponents are asleep, frozen, or recharging (e.g. from using Hyper Beam) this grants no penalty.
   * - Otherwise, if all opponents are paralyzed (or under any of the above conditions), this grants (-3).
   * - If none of the above apply, this grants a {@link BAD_MOVE_PENALTY | Bad Move Penalty}.
   */
  public override getConditionScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.hasTag(BattlerTagType.SUBSTITUTE)) {
      return 0;
    }

    const opponents = user.getOpponents();
    let score = 0;
    opponents.forEach((opp) => {
      if (opp.hasStatusEffect([StatusEffect.PARALYSIS])) {
        score = Math.min(score, -3);
      } else if (
        !opp.hasStatusEffect([StatusEffect.SLEEP, StatusEffect.FREEZE])
        && !opp.hasTag(BattlerTagType.RECHARGING)
      ) {
        score = BAD_MOVE_PENALTY;
      }
    });

    return score;
  }
}

const focusPunchCondition: MoveConditionFunc = (user, _target, _move) =>
  !user.turnData.attacksReceived.find((r) => r.damage);
