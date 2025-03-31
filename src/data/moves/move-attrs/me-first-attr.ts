import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { Move } from "#app/data/moves/move";
import { CallMoveAttr } from "#app/data/moves/move-attrs/call-move-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";

/**
 * Attribute to copy the target's selected (and not yet used)
 * move for the turn and use it against the target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Me_First_(move) | Me First}.
 *
 * NOTE: Unlike in mainline, Me First is currently redirected to the target's ally
 * if the target faints or the target's index is otherwise vacant. This is intentional;
 * we'd rather keep move behavior consistent than replicate what is likely a bug.
 * @extends CallMoveAttr
 */
export class MeFirstAttr extends CallMoveAttr {
  constructor() {
    super();
    this.hasTarget = true;
    this.invalidMoves = invalidMeFirstMoves;
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
    return (user, target, _move) => {
      const targetMove = this.getTargetMove(target);
      return (
        !!targetMove?.isAttackMove()
        && !targetMove.checkFlag(MoveFlags.G_MAX_MOVE, user, target)
        && !this.invalidMoves.has(targetMove.id)
      );
    };
  }

  protected getTargetMove(target: Pokemon): Move | undefined {
    const { turnManager } = globalScene.currentBattle;
    return turnManager.findCommandFromPokemon(target)?.turnMove?.move;
  }
}

const invalidMeFirstMoves: ReadonlySet<MoveId> = Object.freeze(
  new Set([
    MoveId.BEAK_BLAST,
    MoveId.BELCH,
    MoveId.CHATTER,
    MoveId.COMEUPPANCE,
    MoveId.COUNTER,
    MoveId.COVET,
    MoveId.FOCUS_PUNCH,
    MoveId.METAL_BURST,
    MoveId.MIRROR_COAT,
    MoveId.SHELL_TRAP,
    MoveId.STRUGGLE,
    MoveId.THIEF,
  ]),
);
