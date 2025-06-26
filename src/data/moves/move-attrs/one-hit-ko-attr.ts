import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockOneHitKOAbAttr } from "#abilities/block-one-hit-ko-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";
import { BooleanHolder } from "#utils/common-utils";

/**
 * Attribute to mark a move as a {@link https://bulbapedia.bulbagarden.net/wiki/One-hit_knockout_move | one-hit knockout}
 * if the target is not a Boss Pokemon.
 */
export class OneHitKOAttr extends MoveAttr {
  /**
   * If the target is not a Boss, flags the given move as a one-hit KO
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param isOneHitKo a {@linkcode BooleanHolder} containing a flag which, if set to `true`, marks
   * the current attack as a one-hit KO
   * @returns `true` if the move is flagged as a one-hit KO
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, isOneHitKo: BooleanHolder): boolean {
    isOneHitKo.value = true;

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      const cancelled = new BooleanHolder(false);
      applyAbAttrs<BlockOneHitKOAbAttr>(AbAttrFlag.BLOCK_ONE_HIT_KO, target, false, cancelled);
      return !cancelled.value && user.level >= target.level && !target.isMax(false);
    };
  }
}
