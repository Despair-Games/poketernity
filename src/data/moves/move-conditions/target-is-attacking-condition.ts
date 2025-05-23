import { globalScene } from "#app/global-scene";
import { BattleCommand } from "#enums/battle-command";
import { MoveCategory } from "#enums/move-category";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveCondition } from "#moves/move-condition";
import type { MoveConditionFunc } from "#types/move-condition-func";

/**
 * Condition for moves that require the target to have selected
 * an attack for the turn (but not yet acted), e.g.
 * {@link https://bulbapedia.bulbagarden.net/wiki/Sucker_Punch_(move) | Sucker Punch}.
 * @extends MoveCondition
 */
export class TargetIsAttackingCondition extends MoveCondition {
  constructor() {
    super(targetIsAttackingCondition);
  }

  /** Has a 40 percent chance of granting (-1) to the move action. */
  public override getConditionScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return user.randSeedInt(100) < 40 ? -1 : 0;
  }
}

const targetIsAttackingCondition: MoveConditionFunc = (_user, target, _move) => {
  const turnCommand = globalScene.currentBattle.turnManager.findCommandFromPokemon(target);
  if (!turnCommand || !turnCommand.turnMove) {
    return false;
  }
  return (
    turnCommand.command === BattleCommand.FIGHT
    && !target.turnData.acted
    && turnCommand.turnMove.move.category !== MoveCategory.STATUS
  );
};
