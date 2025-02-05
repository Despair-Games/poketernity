import { allMoves } from "#app/data/all-moves";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type MoveConditionFunc } from "#app/data/move-conditions";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import { MoveId } from "#enums/move-id";

/**
 * Attribute used to copy a previously-used move.
 * Copycat copies the last used move, and Mirror Move copies the last move used by the target.
 *
 * Used for {@linkcode MoveId.COPYCAT} and {@linkcode MoveId.MIRROR_MOVE}
 * @see {@linkcode apply} for move selection and move call
 * @extends CallMoveAttr
 */
export class CopyMoveAttr extends CallMoveAttr {
  private mirrorMove: boolean;

  constructor(mirrorMove: boolean, invalidMoves: MoveId[] = []) {
    super();
    this.mirrorMove = mirrorMove;
    this.invalidMoves = invalidMoves;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    this.hasTarget = this.mirrorMove;
    const lastMove = this.mirrorMove ? target.getLastXMoves()[0].moveId : globalScene.currentBattle.lastMoveId;
    return super.apply(user, target, allMoves[lastMove], overridden);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      if (this.mirrorMove) {
        return target.getMoveHistory().length !== 0;
      } else {
        const lastMove = globalScene.currentBattle.lastMoveId;
        return lastMove !== undefined && !this.invalidMoves.includes(lastMove);
      }
    };
  }
}

export const invalidCopycatMoves = [
  MoveId.ASSIST,
  MoveId.BANEFUL_BUNKER,
  MoveId.BEAK_BLAST,
  MoveId.BEHEMOTH_BASH,
  MoveId.BEHEMOTH_BLADE,
  MoveId.BESTOW,
  MoveId.CELEBRATE,
  MoveId.CHATTER,
  MoveId.CIRCLE_THROW,
  MoveId.COPYCAT,
  MoveId.COUNTER,
  MoveId.COVET,
  MoveId.DESTINY_BOND,
  MoveId.DETECT,
  MoveId.DRAGON_TAIL,
  MoveId.DYNAMAX_CANNON,
  MoveId.ENDURE,
  MoveId.FEINT,
  MoveId.FOCUS_PUNCH,
  MoveId.FOLLOW_ME,
  MoveId.HELPING_HAND,
  MoveId.HOLD_HANDS,
  MoveId.KINGS_SHIELD,
  MoveId.MAT_BLOCK,
  MoveId.ME_FIRST,
  MoveId.METRONOME,
  MoveId.MIMIC,
  MoveId.MIRROR_COAT,
  MoveId.MIRROR_MOVE,
  MoveId.NONE,
  MoveId.PROTECT,
  MoveId.RAGE_POWDER,
  MoveId.ROAR,
  MoveId.SHELL_TRAP,
  MoveId.SKETCH,
  MoveId.SLEEP_TALK,
  MoveId.SNATCH,
  MoveId.SPIKY_SHIELD,
  MoveId.SPOTLIGHT,
  MoveId.STRUGGLE,
  MoveId.SWITCHEROO,
  MoveId.THIEF,
  MoveId.TRANSFORM,
  MoveId.TRICK,
  MoveId.WHIRLWIND,
];
