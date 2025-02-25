import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
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
      return target.getMoveHistory().length !== 0;
    };
  }
}

// TODO: Z-Moves can't be copied (if they are ever implemented)
const invalidMirrorMoveMoves: MoveId[] = [
  MoveId.ACUPRESSURE,
  MoveId.AFTER_YOU,
  MoveId.AROMATHERAPY,
  MoveId.AROMATIC_MIST,
  MoveId.AURORA_VEIL,
  MoveId.BEAK_BLAST,
  MoveId.BELCH,
  MoveId.BLAZING_TORQUE,
  MoveId.CHILLY_RECEPTION,
  MoveId.COACHING,
  MoveId.COMBAT_TORQUE,
  MoveId.CONVERSION_2,
  MoveId.COUNTER,
  MoveId.CRAFTY_SHIELD,
  MoveId.CURSE,
  MoveId.DECORATE,
  MoveId.DOODLE,
  MoveId.DOOM_DESIRE,
  MoveId.DRAGON_CHEER,
  MoveId.DYNAMAX_CANNON,
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
  MoveId.HAPPY_HOUR,
  MoveId.HAZE,
  MoveId.HEAL_BELL,
  MoveId.HEAL_PULSE,
  MoveId.HELPING_HAND,
  MoveId.HOLD_HANDS,
  MoveId.HOWL,
  MoveId.INSTRUCT,
  MoveId.ION_DELUGE,
  MoveId.JUNGLE_HEALING,
  MoveId.LIFE_DEW,
  MoveId.LIGHT_SCREEN,
  MoveId.LUCKY_CHANT,
  MoveId.LUNAR_BLESSING,
  MoveId.MAGICAL_TORQUE,
  MoveId.MAGNETIC_FLUX,
  MoveId.MAT_BLOCK,
  MoveId.ME_FIRST,
  MoveId.MIMIC,
  MoveId.MIRROR_COAT,
  MoveId.MIRROR_MOVE,
  MoveId.MIST,
  MoveId.MISTY_TERRAIN,
  MoveId.MUD_SPORT,
  MoveId.NATURE_POWER,
  MoveId.NOXIOUS_TORQUE,
  MoveId.ORDER_UP,
  MoveId.PERISH_SONG,
  MoveId.POWER_SPLIT,
  MoveId.PSYCH_UP,
  MoveId.PSYCHIC_TERRAIN,
  MoveId.PURIFY,
  MoveId.QUICK_GUARD,
  MoveId.RAIN_DANCE,
  MoveId.REFLECT,
  MoveId.REFLECT_TYPE,
  MoveId.ROLE_PLAY,
  MoveId.ROTOTILLER,
  MoveId.SAFEGUARD,
  MoveId.SANDSTORM,
  MoveId.SHELL_TRAP,
  MoveId.SKETCH,
  MoveId.SNOWSCAPE,
  MoveId.SPIKES,
  MoveId.SPIT_UP,
  MoveId.SPOTLIGHT,
  MoveId.STEALTH_ROCK,
  MoveId.STICKY_WEB,
  MoveId.STRUGGLE,
  MoveId.SUNNY_DAY,
  MoveId.TAILWIND,
  MoveId.TEATIME,
  MoveId.TOXIC_SPIKES,
  MoveId.TRANSFORM,
  MoveId.WATER_SPORT,
  MoveId.WICKED_TORQUE,
  MoveId.WIDE_GUARD,
];
