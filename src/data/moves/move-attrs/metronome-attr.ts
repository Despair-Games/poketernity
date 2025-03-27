import { allMoves } from "#app/data/data-lists";
import { type Move } from "#app/data/moves/move";
import { CallMoveAttr } from "#app/data/moves/move-attrs/call-move-attr";
import { type Pokemon } from "#app/field/pokemon";
import { getEnumValues, type BooleanHolder } from "#app/utils";
import { getMaxMoveList } from "#app/utils/move-utils";
import { MoveId } from "#enums/move-id";

/**
 * Attribute used to call a random move.
 * Used for {@linkcode MoveId.METRONOME}
 * @see {@linkcode apply} for move selection and move call
 * @extends CallMoveAttr to call a selected move
 */
export class MetronomeAttr extends CallMoveAttr {
  constructor() {
    super();
    this.invalidMoves = invalidMetronomeMoves;
  }

  /**
   * Selects a random move among all valid callable moves.
   *
   * This function is only public for usage by automated tests. Please use {@linkcode apply} instead.
   */
  public getRandomMove(user: Pokemon): MoveId {
    const moveIds = getEnumValues(MoveId).filter(
      (m) => !this.invalidMoves.has(m) && !allMoves.get(m).name.endsWith(" (N)"),
    );

    return moveIds[user.randSeedInt(moveIds.length)];
  }

  /**
   * User calls a random moveId.
   *
   * Invalid moves are indicated by what is passed in to invalidMoves: {@linkcode invalidMetronomeMoves}
   * @param user Pokemon that used the move and will call a random move
   * @param target Pokemon that will be targeted by the random move (if single target)
   * @param move Move being used
   * @param args Unused
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    return super.apply(user, target, allMoves.get(this.getRandomMove(user)), overridden);
  }
}

/** Note: Many moves (mostly signature moves) were removed compared to mainline. */
const invalidMetronomeMoves: ReadonlySet<MoveId> = Object.freeze(
  new Set([
    ...getMaxMoveList(),
    MoveId.AFTER_YOU,
    MoveId.ASSIST,
    MoveId.BANEFUL_BUNKER,
    MoveId.BEAK_BLAST,
    MoveId.BELCH,
    MoveId.BESTOW,
    MoveId.CELEBRATE,
    MoveId.COMEUPPANCE,
    MoveId.COPYCAT,
    MoveId.COUNTER,
    MoveId.CRAFTY_SHIELD,
    MoveId.DECORATE,
    MoveId.DESTINY_BOND,
    MoveId.DETECT,
    MoveId.ENDURE,
    MoveId.FEINT,
    MoveId.FOCUS_PUNCH,
    MoveId.FOLLOW_ME,
    MoveId.HELPING_HAND,
    MoveId.HOLD_HANDS,
    MoveId.INSTRUCT,
    MoveId.KINGS_SHIELD,
    MoveId.MAT_BLOCK,
    MoveId.ME_FIRST,
    MoveId.METRONOME,
    MoveId.MIMIC,
    MoveId.MIRROR_COAT,
    MoveId.MIRROR_MOVE,
    MoveId.NONE,
    MoveId.OBSTRUCT,
    MoveId.ORDER_UP,
    MoveId.PROTECT,
    MoveId.QUASH,
    MoveId.QUICK_GUARD,
    MoveId.RAGE_POWDER,
    MoveId.REVIVAL_BLESSING,
    MoveId.SHELL_TRAP,
    MoveId.SILK_TRAP,
    MoveId.SKETCH,
    MoveId.SLEEP_TALK,
    MoveId.SNATCH,
    MoveId.SNORE,
    MoveId.SPIKY_SHIELD,
    MoveId.SPOTLIGHT,
    MoveId.STRUGGLE,
    MoveId.SWITCHEROO,
    MoveId.TRANSFORM,
    MoveId.TRICK,
    MoveId.WIDE_GUARD,
  ]),
);
