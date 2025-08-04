import { MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-types";

export class EncoreAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.ENCORE, false, { failOnOverlap: true });
  }

  public override getCondition(): MoveConditionFunc {
    return (user, target, move): boolean => {
      if (target.isMax()) {
        return false;
      }

      const lastMoves = target.getLastXMoves(-1).filter((mv) => !mv.virtual);
      if (!lastMoves.length) {
        return false;
      }

      const repeatableMove = lastMoves[0];

      if (!repeatableMove.move.id || repeatableMove.virtual) {
        return false;
      }

      switch (repeatableMove.move.id) {
        case MoveId.MIMIC:
        case MoveId.MIRROR_MOVE:
        case MoveId.TRANSFORM:
        case MoveId.STRUGGLE:
        case MoveId.SKETCH:
        case MoveId.SLEEP_TALK:
        case MoveId.ENCORE:
        case MoveId.DYNAMAX_CANNON:
          return false;
      }

      return (super.getCondition() as MoveConditionFunc)(user, target, move);
    };
  }

  /**
   * Grants a {@link MAJOR_EFFECT_SCORE_BONUS | major bonus} if the target's last move was a status move
   * and the user outspeeds the target. Otherwise, grants 20%(+1).
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const lastMove = target.getLastXMoves(-1).find((turnMove) => !turnMove.virtual)?.move;

    if (lastMove?.isStatusMove(target, user) && user.outspeeds(target, true)) {
      return MAJOR_EFFECT_SCORE_BONUS;
    }
    return this.getRandomScore(user, 20);
  }
}
