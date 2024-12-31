import type { Pokemon } from "#app/field/pokemon";
import { BooleanHolder } from "#app/utils";
import { BlockOneHitKOAbAttr } from "#app/data/ab-attrs/block-one-hit-ko-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class OneHitKOAttr extends MoveAttr {
  /**
   * If the target is not a Boss, flags the given move as a one-hit KO
   * @param _user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param isOneHitKo a {@linkcode BooleanHolder} containing a flag which, if set to `true`, marks
   * the current attack as a one-hit KO
   * @returns `true` if the move is flagged as a one-hit KO
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, isOneHitKo: BooleanHolder): boolean {
    if (target.isBossImmune()) {
      return false;
    }
    isOneHitKo.value = true;

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      const cancelled = new BooleanHolder(false);
      applyAbAttrs(BlockOneHitKOAbAttr, target, cancelled);
      return !cancelled.value && user.level >= target.level;
    };
  }
}
