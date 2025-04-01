import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { BlockOneHitKOAbAttr } from "#app/data/abilities/ab-attrs/block-one-hit-ko-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Move } from "#app/data/moves/move";
import { MoveAttr } from "#app/data/moves/move-attrs/move-attr";
import type { Pokemon } from "#app/field/pokemon";
import { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Attribute to mark a move as a {@link https://bulbapedia.bulbagarden.net/wiki/One-hit_knockout_move | one-hit knockout}
 * if the target is not a Boss Pokemon.
 * @extends MoveAttr
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
