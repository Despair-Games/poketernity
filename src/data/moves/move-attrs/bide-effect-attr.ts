import { globalScene } from "#app/global-scene";
import type { BideTag } from "#battler-tags/bide-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { OverrideMoveEffectAttr } from "#moves/override-move-effect-attr";
import { CommonAnimPhase } from "#phases/common-anim-phase";
import type { MoveConditionFunc } from "#types/move-condition-func";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * Attribute to resolve the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Bide_(move) | Bide}
 * for each turn of its execution. This includes:
 * - Adding a tag to the user to record received attack damage on the first turn
 * - Playing Bide's "charging" animation on all but the last turn of execution
 * - Cancelling Bide's damage on all but the last turn of execution
 */
export class BideEffectAttr extends OverrideMoveEffectAttr {
  public override apply(user: Pokemon, _target: Pokemon | null, _move: Move, overridden: BooleanHolder): boolean {
    const bideTag = user.getTag<BideTag>(BattlerTagType.BIDE);

    if (!bideTag || bideTag.turnCount > 1) {
      // Try to add Bide's tag to the user.
      // If the tag already exists on the user, this does nothing.
      user.addTag(BattlerTagType.BIDE);
      // Play Bide's "charging" animation
      globalScene.phaseManager.unshiftPhase(new CommonAnimPhase(CommonAnim.BIDE, user.getBattlerIndex()));
      // Cancel other effects in the move's execution (i.e. the move's damage)
      overridden.value = true;
    }
    return true;
  }

  /**
   * Bide fails on its last turn of execution if the user
   * has not received any attack damage since it was first used.
   */
  public override getCondition(): MoveConditionFunc {
    return (user: Pokemon) => {
      const bideTag = user.getTag<BideTag>(BattlerTagType.BIDE);
      if (bideTag) {
        return bideTag.turnCount > 1 || bideTag.attackDamage > 0;
      }
      return true;
    };
  }
}
