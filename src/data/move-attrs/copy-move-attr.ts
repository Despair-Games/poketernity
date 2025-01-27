import { allMoves } from "#app/data/all-moves";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type MoveConditionFunc } from "#app/data/move-conditions";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import { Moves } from "#enums/moves";

/**
 * Attribute used to copy a previously-used move.
 * Copycat copies the last used move, and Mirror Move copies the last move used by the target.
 *
 * Used for {@linkcode Moves.COPYCAT} and {@linkcode Moves.MIRROR_MOVE}
 * @see {@linkcode apply} for move selection and move call
 * @extends CallMoveAttr
 */
export class CopyMoveAttr extends CallMoveAttr {
  private mirrorMove: boolean;

  constructor(mirrorMove: boolean, invalidMoves: Moves[] = []) {
    super();
    this.mirrorMove = mirrorMove;
    this.invalidMoves = invalidMoves;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    this.hasTarget = this.mirrorMove;
    const lastMove = this.mirrorMove ? target.getLastXMoves()[0].move : globalScene.currentBattle.lastMove;
    return super.apply(user, target, allMoves[lastMove], overridden);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      if (this.mirrorMove) {
        return target.getMoveHistory().length !== 0;
      } else {
        const lastMove = globalScene.currentBattle.lastMove;
        return lastMove !== undefined && !this.invalidMoves.includes(lastMove);
      }
    };
  }
}

export const invalidCopycatMoves = [
  Moves.ASSIST,
  Moves.BANEFUL_BUNKER,
  Moves.BEAK_BLAST,
  Moves.BEHEMOTH_BASH,
  Moves.BEHEMOTH_BLADE,
  Moves.BESTOW,
  Moves.CELEBRATE,
  Moves.CHATTER,
  Moves.CIRCLE_THROW,
  Moves.COPYCAT,
  Moves.COUNTER,
  Moves.COVET,
  Moves.DESTINY_BOND,
  Moves.DETECT,
  Moves.DRAGON_TAIL,
  Moves.DYNAMAX_CANNON,
  Moves.ENDURE,
  Moves.FEINT,
  Moves.FOCUS_PUNCH,
  Moves.FOLLOW_ME,
  Moves.HELPING_HAND,
  Moves.HOLD_HANDS,
  Moves.KINGS_SHIELD,
  Moves.MAT_BLOCK,
  Moves.ME_FIRST,
  Moves.METRONOME,
  Moves.MIMIC,
  Moves.MIRROR_COAT,
  Moves.MIRROR_MOVE,
  Moves.NONE,
  Moves.PROTECT,
  Moves.RAGE_POWDER,
  Moves.ROAR,
  Moves.SHELL_TRAP,
  Moves.SKETCH,
  Moves.SLEEP_TALK,
  Moves.SNATCH,
  Moves.SPIKY_SHIELD,
  Moves.SPOTLIGHT,
  Moves.STRUGGLE,
  Moves.SWITCHEROO,
  Moves.THIEF,
  Moves.TRANSFORM,
  Moves.TRICK,
  Moves.WHIRLWIND,
];
