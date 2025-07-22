import { BAD_MOVE_PENALTY } from "#constants/ai-constants";
import { Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveCondition } from "#moves/move-condition";

/**
 * Condition for the move {@link https://bulbapedia.bulbagarden.net/wiki/After_You_(move) | After You}.
 * Requires the user to have moved before the target in turn order.
 * @extends MoveCondition
 */
export class AfterYouCondition extends MoveCondition {
  constructor() {
    super((_user, target, _move) => !target.turnData.acted);
  }

  /**
   * Grants a {@link BAD_MOVE_PENALTY | Bad Move Penalty} if the move doesn't have
   * increased priority and the user is slower than the target
   */
  public override getConditionScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (move.getPriority(user) > 0 || user.getEffectiveStat(Stat.SPD) > target.getEffectiveStat(Stat.SPD)) {
      return 0;
    }
    return BAD_MOVE_PENALTY;
  }
}
