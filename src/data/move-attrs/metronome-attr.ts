import { allMoves } from "#app/data/data-lists";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
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
      (m) => !this.invalidMoves.includes(m) && !allMoves.get(m).name.endsWith(" (N)"),
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

const invalidMetronomeMoves: MoveId[] = [
  ...getMaxMoveList(),
  MoveId.AFTER_YOU,
  MoveId.APPLE_ACID,
  MoveId.ARMOR_CANNON,
  MoveId.ASSIST,
  MoveId.ASTRAL_BARRAGE,
  MoveId.AURA_WHEEL,
  MoveId.BANEFUL_BUNKER,
  MoveId.BEAK_BLAST,
  MoveId.BEHEMOTH_BASH,
  MoveId.BEHEMOTH_BLADE,
  MoveId.BELCH,
  MoveId.BESTOW,
  MoveId.BLAZING_TORQUE,
  MoveId.BODY_PRESS,
  MoveId.BRANCH_POKE,
  MoveId.BREAKING_SWIPE,
  MoveId.CELEBRATE,
  MoveId.CHATTER,
  MoveId.CHILLING_WATER,
  MoveId.CHILLY_RECEPTION,
  MoveId.CLANGOROUS_SOUL,
  MoveId.COLLISION_COURSE,
  MoveId.COMBAT_TORQUE,
  MoveId.COMEUPPANCE,
  MoveId.COPYCAT,
  MoveId.COUNTER,
  MoveId.COVET,
  MoveId.CRAFTY_SHIELD,
  MoveId.DECORATE,
  MoveId.DESTINY_BOND,
  MoveId.DETECT,
  MoveId.DIAMOND_STORM,
  MoveId.DOODLE,
  MoveId.DOUBLE_IRON_BASH,
  MoveId.DOUBLE_SHOCK,
  MoveId.DRAGON_ASCENT,
  MoveId.DRAGON_ENERGY,
  MoveId.DRUM_BEATING,
  MoveId.DYNAMAX_CANNON,
  MoveId.ELECTRO_DRIFT,
  MoveId.ENDURE,
  MoveId.ETERNABEAM,
  MoveId.FALSE_SURRENDER,
  MoveId.FEINT,
  MoveId.FIERY_WRATH,
  MoveId.FILLET_AWAY,
  MoveId.FLEUR_CANNON,
  MoveId.FOCUS_PUNCH,
  MoveId.FOLLOW_ME,
  MoveId.FREEZE_SHOCK,
  MoveId.FREEZING_GLARE,
  MoveId.GLACIAL_LANCE,
  MoveId.GRAV_APPLE,
  MoveId.HELPING_HAND,
  MoveId.HOLD_HANDS,
  MoveId.HYPER_DRILL,
  MoveId.HYPERSPACE_FURY,
  MoveId.HYPERSPACE_HOLE,
  MoveId.ICE_BURN,
  MoveId.INSTRUCT,
  MoveId.JET_PUNCH,
  MoveId.JUNGLE_HEALING,
  MoveId.KINGS_SHIELD,
  MoveId.LIFE_DEW,
  MoveId.LIGHT_OF_RUIN,
  MoveId.MAKE_IT_RAIN,
  MoveId.MAGICAL_TORQUE,
  MoveId.MAT_BLOCK,
  MoveId.ME_FIRST,
  MoveId.METEOR_ASSAULT,
  MoveId.METRONOME,
  MoveId.MIMIC,
  MoveId.MIND_BLOWN,
  MoveId.MIRROR_COAT,
  MoveId.MIRROR_MOVE,
  MoveId.MOONGEIST_BEAM,
  MoveId.NATURE_POWER,
  MoveId.NATURES_MADNESS,
  MoveId.NONE,
  MoveId.NOXIOUS_TORQUE,
  MoveId.OBSTRUCT,
  MoveId.ORDER_UP,
  MoveId.ORIGIN_PULSE,
  MoveId.OVERDRIVE,
  MoveId.PHOTON_GEYSER,
  MoveId.PLASMA_FISTS,
  MoveId.POPULATION_BOMB,
  MoveId.POUNCE,
  MoveId.POWER_SHIFT,
  MoveId.PRECIPICE_BLADES,
  MoveId.PROTECT,
  MoveId.PYRO_BALL,
  MoveId.QUASH,
  MoveId.QUICK_GUARD,
  MoveId.RAGE_FIST,
  MoveId.RAGE_POWDER,
  MoveId.RAGING_BULL,
  MoveId.RAGING_FURY,
  MoveId.RELIC_SONG,
  MoveId.REVIVAL_BLESSING,
  MoveId.RUINATION,
  MoveId.SALT_CURE,
  MoveId.SECRET_SWORD,
  MoveId.SHED_TAIL,
  MoveId.SHELL_TRAP,
  MoveId.SILK_TRAP,
  MoveId.SKETCH,
  MoveId.SLEEP_TALK,
  MoveId.SNAP_TRAP,
  MoveId.SNARL,
  MoveId.SNATCH,
  MoveId.SNORE,
  MoveId.SNOWSCAPE,
  MoveId.SPECTRAL_THIEF,
  MoveId.SPICY_EXTRACT,
  MoveId.SPIKY_SHIELD,
  MoveId.SPIRIT_BREAK,
  MoveId.SPOTLIGHT,
  MoveId.STEAM_ERUPTION,
  MoveId.STEEL_BEAM,
  MoveId.STRANGE_STEAM,
  MoveId.STRUGGLE,
  MoveId.SUNSTEEL_STRIKE,
  MoveId.SURGING_STRIKES,
  MoveId.SWITCHEROO,
  MoveId.TECHNO_BLAST,
  MoveId.TERA_STARSTORM,
  MoveId.THIEF,
  MoveId.THOUSAND_ARROWS,
  MoveId.THOUSAND_WAVES,
  MoveId.THUNDER_CAGE,
  MoveId.THUNDEROUS_KICK,
  MoveId.TIDY_UP,
  MoveId.TRAILBLAZE,
  MoveId.TRANSFORM,
  MoveId.TRICK,
  MoveId.TWIN_BEAM,
  MoveId.V_CREATE,
  MoveId.WICKED_BLOW,
  MoveId.WICKED_TORQUE,
  MoveId.WIDE_GUARD,
];
