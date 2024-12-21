import type { Pokemon } from "#app/field/pokemon";
import { BooleanHolder } from "#app/utils";
import { BlockOneHitKOAbAttr } from "#app/data/ab-attrs/block-one-hit-ko-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class OneHitKOAttr extends MoveAttr {
  override apply(_user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    if (target.isBossImmune()) {
      return false;
    }

    (args[0] as BooleanHolder).value = true;

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
