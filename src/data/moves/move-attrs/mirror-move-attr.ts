import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { type Move } from "#app/data/moves/move";
import { CallMoveAttr } from "#app/data/moves/move-attrs/call-move-attr";
import { type Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { getMaxMoveList } from "#app/utils/move-utils";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";

/**
 * Attribute used to copy the last move used by the target.
 *
 * Used for {@linkcode MoveId.MIRROR_MOVE}
 * @see {@linkcode apply} for move selection and move call
 * @extends CallMoveAttr
 */
export class MirrorMoveAttr extends CallMoveAttr {
  constructor() {
    super();
    this.invalidMoves = invalidMirrorMoveMoves;
    this.hasTarget = true;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    const lastMove = target.getLastXMoves()[0].move;
    if (lastMove.hasFlag(MoveFlags.G_MAX_MOVE)) {
      return false;
    }
    return super.apply(user, target, lastMove, overridden);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      const lastMove = target.getLastXMoves()[0]?.move;
      return !!lastMove && !this.invalidMoves.has(lastMove.id);
    };
  }
}

// TODO: Z-Moves can't be copied (if they are ever implemented)
/** Note: This list diverges from mainline by removing some moves. */
const invalidMirrorMoveMoves: ReadonlySet<MoveId> = Object.freeze(
  new Set([
    ...getMaxMoveList(),
    MoveId.ACUPRESSURE,
    MoveId.AFTER_YOU,
    MoveId.AROMATIC_MIST,
    MoveId.BEAK_BLAST,
    MoveId.BELCH,
    MoveId.CHILLY_RECEPTION,
    MoveId.COACHING,
    MoveId.CONVERSION_2,
    MoveId.COUNTER,
    MoveId.CRAFTY_SHIELD,
    MoveId.CURSE,
    MoveId.DECORATE,
    MoveId.DOODLE,
    MoveId.DOOM_DESIRE,
    MoveId.DRAGON_CHEER,
    MoveId.ELECTRIC_TERRAIN,
    MoveId.FINAL_GAMBIT,
    MoveId.FLORAL_HEALING,
    MoveId.FLOWER_SHIELD,
    MoveId.FOCUS_PUNCH,
    MoveId.FUTURE_SIGHT,
    MoveId.GEAR_UP,
    MoveId.GRASSY_TERRAIN,
    MoveId.GRAVITY,
    MoveId.GUARD_SPLIT,
    MoveId.HAIL,
    MoveId.HAZE,
    MoveId.HEAL_PULSE,
    MoveId.HELPING_HAND,
    MoveId.HOLD_HANDS,
    MoveId.INSTRUCT,
    MoveId.ION_DELUGE,
    MoveId.MAGNETIC_FLUX,
    MoveId.MAT_BLOCK,
    MoveId.ME_FIRST,
    MoveId.MIMIC,
    MoveId.MIRROR_COAT,
    MoveId.MIRROR_MOVE,
    MoveId.MIST,
    MoveId.MISTY_TERRAIN,
    MoveId.MUD_SPORT,
    MoveId.NONE,
    MoveId.ORDER_UP,
    MoveId.PERISH_SONG,
    MoveId.POWER_SPLIT,
    MoveId.PSYCH_UP,
    MoveId.PSYCHIC_TERRAIN,
    MoveId.PURIFY,
    MoveId.QUICK_GUARD,
    MoveId.RAIN_DANCE,
    MoveId.REFLECT_TYPE,
    MoveId.ROLE_PLAY,
    MoveId.ROTOTILLER,
    MoveId.SANDSTORM,
    MoveId.SHELL_TRAP,
    MoveId.SKETCH,
    MoveId.SNOWSCAPE,
    MoveId.SPIT_UP,
    MoveId.SPOTLIGHT,
    MoveId.STRUGGLE,
    MoveId.SUNNY_DAY,
    MoveId.TEATIME,
    MoveId.TRANSFORM,
    MoveId.WATER_SPORT,
    MoveId.WIDE_GUARD,
  ]),
);
