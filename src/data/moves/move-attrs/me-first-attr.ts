import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Move } from "#app/data/moves/move";
import { CallMoveAttr } from "#app/data/moves/move-attrs/call-move-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";

/**
 * Attribute to copy the target's selected (and not yet used)
 * move for the turn and use it against the target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Me_First_(move) | Me First}.
 * @extends CallMoveAttr
 */
export class MeFirstAttr extends CallMoveAttr {
  constructor() {
    super();
    this.hasTarget = true;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    const targetMove = this.getTargetMove(target);
    if (targetMove) {
      user.addTag(BattlerTagType.ME_FIRST_POWER_BOOST);
      return super.apply(user, target, targetMove, overridden);
    }
    return false;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      const targetMove = this.getTargetMove(target);
      return !!targetMove?.isAttackMove() && !invalidMeFirstMoves.has(targetMove.id);
    };
  }

  protected getTargetMove(target: Pokemon): Move | undefined {
    const { turnManager } = globalScene.currentBattle;
    return turnManager.findCommandFromPokemon(target)?.turnMove?.move;
  }
}

export const invalidMeFirstMoves: Set<MoveId> = new Set([
  MoveId.BEAK_BLAST,
  MoveId.BELCH,
  MoveId.CHATTER,
  MoveId.COUNTER,
  MoveId.COVET,
  MoveId.FOCUS_PUNCH,
  MoveId.METAL_BURST,
  MoveId.MIRROR_COAT,
  MoveId.SHELL_TRAP,
  MoveId.STRUGGLE,
  MoveId.THIEF,
]);
