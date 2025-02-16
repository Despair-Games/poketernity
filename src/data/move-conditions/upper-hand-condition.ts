import { allMoves } from "#app/data/data-lists";
import { MoveCondition } from "#app/data/move-conditions/move-condition";
import { globalScene } from "#app/global-scene";
import { BattleCommand } from "#enums/battle-command";
import { MoveCategory } from "#enums/move-category";

/**
 * Condition used by the move {@link https://bulbapedia.bulbagarden.net/wiki/Upper_Hand_(move) | Upper Hand}.
 * Moves with this condition are only successful when the target has selected
 * a high-priority attack (after factoring in priority-boosting effects) and
 * hasn't moved yet this turn.
 */
export class UpperHandCondition extends MoveCondition {
  constructor() {
    super((_user, target, _move) => {
      const targetCommand = globalScene.currentBattle.turnCommands[target.getBattlerIndex()];

      return (
        !!targetCommand
        && targetCommand.command === BattleCommand.FIGHT
        && !target.turnData.acted
        && !!targetCommand.move?.moveId
        && allMoves[targetCommand.move.moveId].category !== MoveCategory.STATUS
        && allMoves[targetCommand.move.moveId].getPriority(target) > 0
      );
    });
  }
}
