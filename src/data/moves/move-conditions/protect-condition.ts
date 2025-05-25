import { MoveResult } from "#enums/move-result";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveCondition } from "#moves/move-condition";
import { ProtectAttr } from "#moves/protect-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";

export class ProtectCondition extends MoveCondition {
  constructor() {
    super(protectCondition);
  }

  /**
   * This condition does not contribute to score.
   * Instead, consecutive use of Protect and similar moves is discouraged
   * by the moves' {@linkcode ProtectAttr.getRawEffectScore | Effect Score functions}.
   */
  public override getConditionScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}

const protectCondition: MoveConditionFunc = (user, _target, _move) => {
  const moveHistory = user.getLastXMoves(-1).filter((mv) => !mv.virtual);
  const lastNonUse = moveHistory.findIndex((mv) => mv.result !== MoveResult.SUCCESS || !mv.move.hasAttr(ProtectAttr));

  if (lastNonUse === -1) {
    return !user.randSeedInt(Math.pow(3, moveHistory.length));
  }
  return !user.randSeedInt(Math.pow(3, lastNonUse));
};
