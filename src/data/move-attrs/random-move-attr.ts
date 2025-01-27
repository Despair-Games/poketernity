import { allMoves } from "#app/data/all-moves";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type Pokemon } from "#app/field/pokemon";
import { getEnumValues, type BooleanHolder } from "#app/utils";
import { Moves } from "#enums/moves";

/**
 * Attribute used to call a random move.
 * Used for {@linkcode Moves.METRONOME}
 * @see {@linkcode apply} for move selection and move call
 * @extends CallMoveAttr to call a selected move
 */
export class RandomMoveAttr extends CallMoveAttr {
  constructor(invalidMoves: Moves[]) {
    super();
    this.invalidMoves = invalidMoves;
  }

  /**
   * This function exists solely to allow tests to override the randomly selected move by mocking this function.
   */
  public getMoveOverride(): Moves | null {
    return null;
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
    const moveIds = getEnumValues(Moves).filter(
      (m) => !this.invalidMoves.includes(m) && !allMoves[m].name.endsWith(" (N)"),
    );

    const moveId = this.getMoveOverride() ?? moveIds[user.randSeedInt(moveIds.length)];

    return super.apply(user, target, allMoves[moveId], overridden);
  }
}

export const invalidMetronomeMoves: Moves[] = [
  Moves.AFTER_YOU,
  Moves.APPLE_ACID,
  Moves.ARMOR_CANNON,
  Moves.ASSIST,
  Moves.ASTRAL_BARRAGE,
  Moves.AURA_WHEEL,
  Moves.BANEFUL_BUNKER,
  Moves.BEAK_BLAST,
  Moves.BEHEMOTH_BASH,
  Moves.BEHEMOTH_BLADE,
  Moves.BELCH,
  Moves.BESTOW,
  Moves.BLAZING_TORQUE,
  Moves.BODY_PRESS,
  Moves.BRANCH_POKE,
  Moves.BREAKING_SWIPE,
  Moves.CELEBRATE,
  Moves.CHATTER,
  Moves.CHILLING_WATER,
  Moves.CHILLY_RECEPTION,
  Moves.CLANGOROUS_SOUL,
  Moves.COLLISION_COURSE,
  Moves.COMBAT_TORQUE,
  Moves.COMEUPPANCE,
  Moves.COPYCAT,
  Moves.COUNTER,
  Moves.COVET,
  Moves.CRAFTY_SHIELD,
  Moves.DECORATE,
  Moves.DESTINY_BOND,
  Moves.DETECT,
  Moves.DIAMOND_STORM,
  Moves.DOODLE,
  Moves.DOUBLE_IRON_BASH,
  Moves.DOUBLE_SHOCK,
  Moves.DRAGON_ASCENT,
  Moves.DRAGON_ENERGY,
  Moves.DRUM_BEATING,
  Moves.DYNAMAX_CANNON,
  Moves.ELECTRO_DRIFT,
  Moves.ENDURE,
  Moves.ETERNABEAM,
  Moves.FALSE_SURRENDER,
  Moves.FEINT,
  Moves.FIERY_WRATH,
  Moves.FILLET_AWAY,
  Moves.FLEUR_CANNON,
  Moves.FOCUS_PUNCH,
  Moves.FOLLOW_ME,
  Moves.FREEZE_SHOCK,
  Moves.FREEZING_GLARE,
  Moves.GLACIAL_LANCE,
  Moves.GRAV_APPLE,
  Moves.HELPING_HAND,
  Moves.HOLD_HANDS,
  Moves.HYPER_DRILL,
  Moves.HYPERSPACE_FURY,
  Moves.HYPERSPACE_HOLE,
  Moves.ICE_BURN,
  Moves.INSTRUCT,
  Moves.JET_PUNCH,
  Moves.JUNGLE_HEALING,
  Moves.KINGS_SHIELD,
  Moves.LIFE_DEW,
  Moves.LIGHT_OF_RUIN,
  Moves.MAKE_IT_RAIN,
  Moves.MAGICAL_TORQUE,
  Moves.MAT_BLOCK,
  Moves.ME_FIRST,
  Moves.METEOR_ASSAULT,
  Moves.METRONOME,
  Moves.MIMIC,
  Moves.MIND_BLOWN,
  Moves.MIRROR_COAT,
  Moves.MIRROR_MOVE,
  Moves.MOONGEIST_BEAM,
  Moves.NATURE_POWER,
  Moves.NATURES_MADNESS,
  Moves.NONE,
  Moves.NOXIOUS_TORQUE,
  Moves.OBSTRUCT,
  Moves.ORDER_UP,
  Moves.ORIGIN_PULSE,
  Moves.OVERDRIVE,
  Moves.PHOTON_GEYSER,
  Moves.PLASMA_FISTS,
  Moves.POPULATION_BOMB,
  Moves.POUNCE,
  Moves.POWER_SHIFT,
  Moves.PRECIPICE_BLADES,
  Moves.PROTECT,
  Moves.PYRO_BALL,
  Moves.QUASH,
  Moves.QUICK_GUARD,
  Moves.RAGE_FIST,
  Moves.RAGE_POWDER,
  Moves.RAGING_BULL,
  Moves.RAGING_FURY,
  Moves.RELIC_SONG,
  Moves.REVIVAL_BLESSING,
  Moves.RUINATION,
  Moves.SALT_CURE,
  Moves.SECRET_SWORD,
  Moves.SHED_TAIL,
  Moves.SHELL_TRAP,
  Moves.SILK_TRAP,
  Moves.SKETCH,
  Moves.SLEEP_TALK,
  Moves.SNAP_TRAP,
  Moves.SNARL,
  Moves.SNATCH,
  Moves.SNORE,
  Moves.SNOWSCAPE,
  Moves.SPECTRAL_THIEF,
  Moves.SPICY_EXTRACT,
  Moves.SPIKY_SHIELD,
  Moves.SPIRIT_BREAK,
  Moves.SPOTLIGHT,
  Moves.STEAM_ERUPTION,
  Moves.STEEL_BEAM,
  Moves.STRANGE_STEAM,
  Moves.STRUGGLE,
  Moves.SUNSTEEL_STRIKE,
  Moves.SURGING_STRIKES,
  Moves.SWITCHEROO,
  Moves.TECHNO_BLAST,
  Moves.TERA_STARSTORM,
  Moves.THIEF,
  Moves.THOUSAND_ARROWS,
  Moves.THOUSAND_WAVES,
  Moves.THUNDER_CAGE,
  Moves.THUNDEROUS_KICK,
  Moves.TIDY_UP,
  Moves.TRAILBLAZE,
  Moves.TRANSFORM,
  Moves.TRICK,
  Moves.TWIN_BEAM,
  Moves.V_CREATE,
  Moves.WICKED_BLOW,
  Moves.WICKED_TORQUE,
  Moves.WIDE_GUARD,
];
