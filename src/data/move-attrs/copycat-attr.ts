import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import { MoveId } from "#enums/move-id";

/**
 * Attribute used to copy the last move used by any pokemon.
 *
 * Used for {@linkcode MoveId.COPYCAT}
 * @see {@linkcode apply} for move selection and move call
 * @extends CallMoveAttr
 */
export class CopycatAttr extends CallMoveAttr {
  constructor() {
    super();
    this.invalidMoves = invalidCopycatMoves;
    this.hasTarget = false;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    const lastMove = globalScene.currentBattle.lastMove;
    return super.apply(user, target, lastMove, overridden);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) => {
      const lastMove = globalScene.currentBattle.lastMove;
      return !!lastMove && !this.invalidMoves.includes(lastMove.id);
    };
  }
}

const invalidCopycatMoves = [
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
