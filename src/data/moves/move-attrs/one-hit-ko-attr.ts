import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { MoveConditionFunc } from "#types/move-types";
import { ValueHolder } from "#utils/common-utils";

/**
 * Attribute to mark a move as a {@link https://bulbapedia.bulbagarden.net/wiki/One-hit_knockout_move | one-hit knockout}
 * if the target is not a Boss Pokemon.
 */
export class OneHitKOAttr extends MoveAttr {
  /**
   * If the target is not a Boss, flags the given move as a one-hit KO
   * @param isOneHitKo - A {@linkcode ValueHolder} containing a flag which, if set to `true`,
   * marks the current attack as a one-hit KO
   * @returns `true` if the move is flagged as a one-hit KO
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, isOneHitKo: ValueHolder<boolean>): boolean {
    isOneHitKo.value = true;

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      const cancelled = new ValueHolder(false);
      applyAbAttrs("BlockOneHitKOAbAttr", { pokemon: target, simulated: false, cancelled });
      return !cancelled.value && user.level >= target.level && !target.isMax(false);
    };
  }
}
