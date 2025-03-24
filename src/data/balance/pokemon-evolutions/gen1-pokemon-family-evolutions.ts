import { EvolutionItem } from "#enums/evolution-item";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import {
  ADVANCED_ITEM_EVO_LEVEL,
  ANNIHILAPE_EVO_LEVEL,
  BABY_HAPPINESS_EVO_LEVEL,
  EEVEE_FAMILY_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
  HAPPINESS_EVO_LEVEL,
  LICKILICKY_EVO_LEVEL,
  MR_MIME_EVO_LEVEL,
  SLOWPOKE_FAMILY_EVO_LEVEL,
  TANGROWTH_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";
import {
  type PokemonEvolutions,
  SpeciesFormEvolution,
  SpeciesEvolution,
  SpeciesFriendshipEvolutionCondition,
  NightEvolutionCondition,
  DayEvolutionCondition,
  MoveKnownEvoCondition,
  TypeKnownEvoCondition,
} from "#app/data/pokemon-evolutions";
import { ElementalType } from "#enums/elemental-type";

export const gen1pokemonFamilyEvolutions: PokemonEvolutions = {
  [SpeciesId.BULBASAUR]: [new SpeciesEvolution(SpeciesId.IVYSAUR, 16, null, null)],
  [SpeciesId.IVYSAUR]: [new SpeciesEvolution(SpeciesId.VENUSAUR, 32, null, null)],
  [SpeciesId.CHARMANDER]: [new SpeciesEvolution(SpeciesId.CHARMELEON, 16, null, null)],
  [SpeciesId.CHARMELEON]: [new SpeciesEvolution(SpeciesId.CHARIZARD, 36, null, null)],
  [SpeciesId.SQUIRTLE]: [new SpeciesEvolution(SpeciesId.WARTORTLE, 16, null, null)],
  [SpeciesId.WARTORTLE]: [new SpeciesEvolution(SpeciesId.BLASTOISE, 36, null, null)],
  [SpeciesId.CATERPIE]: [new SpeciesEvolution(SpeciesId.METAPOD, 7, null, null)],
  [SpeciesId.METAPOD]: [new SpeciesEvolution(SpeciesId.BUTTERFREE, 10, null, null)],
  [SpeciesId.WEEDLE]: [new SpeciesEvolution(SpeciesId.KAKUNA, 7, null, null)],
  [SpeciesId.KAKUNA]: [new SpeciesEvolution(SpeciesId.BEEDRILL, 10, null, null)],
  [SpeciesId.PIDGEY]: [new SpeciesEvolution(SpeciesId.PIDGEOTTO, 18, null, null)],
  [SpeciesId.PIDGEOTTO]: [new SpeciesEvolution(SpeciesId.PIDGEOT, 36, null, null)],
  [SpeciesId.RATTATA]: [new SpeciesEvolution(SpeciesId.RATICATE, 20, null, null)],
  [SpeciesId.SPEAROW]: [new SpeciesEvolution(SpeciesId.FEAROW, 20, null, null)],
  [SpeciesId.EKANS]: [new SpeciesEvolution(SpeciesId.ARBOK, 22, null, null)],
  /** Pichu is from gen 2 */
  [SpeciesId.PICHU]: [
    new SpeciesFormEvolution(
      SpeciesId.PIKACHU,
      "spiky",
      "partner",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(90)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.PIKACHU,
      "",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(90)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  /** Custom method of evolving into Alolan Raichu */
  [SpeciesId.PIKACHU]: [
    new SpeciesFormEvolution(SpeciesId.RAICHU, "", "", 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(
      SpeciesId.RAICHU,
      "partner",
      "",
      1,
      EvolutionItem.THUNDER_STONE,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALOLA_RAICHU,
      "",
      "",
      1,
      EvolutionItem.SHINY_STONE,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALOLA_RAICHU,
      "partner",
      "",
      1,
      EvolutionItem.SHINY_STONE,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [SpeciesId.SANDSHREW]: [new SpeciesEvolution(SpeciesId.SANDSLASH, 22, null, null)],
  [SpeciesId.NIDORAN_F]: [new SpeciesEvolution(SpeciesId.NIDORINA, 16, null, null)],
  [SpeciesId.NIDORINA]: [
    new SpeciesEvolution(SpeciesId.NIDOQUEEN, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.NIDORAN_M]: [new SpeciesEvolution(SpeciesId.NIDORINO, 16, null, null)],
  [SpeciesId.NIDORINO]: [
    new SpeciesEvolution(SpeciesId.NIDOKING, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Cleffa is from gen 2 */
  [SpeciesId.CLEFFA]: [
    new SpeciesEvolution(
      SpeciesId.CLEFAIRY,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(70)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.CLEFAIRY]: [
    new SpeciesEvolution(SpeciesId.CLEFABLE, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],

  [SpeciesId.VULPIX]: [
    new SpeciesEvolution(SpeciesId.NINETALES, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Igglybuff is from gen 2 */
  [SpeciesId.IGGLYBUFF]: [
    new SpeciesEvolution(
      SpeciesId.JIGGLYPUFF,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(70)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.JIGGLYPUFF]: [
    new SpeciesEvolution(SpeciesId.WIGGLYTUFF, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.ZUBAT]: [new SpeciesEvolution(SpeciesId.GOLBAT, 22, null, null)],
  [SpeciesId.GOLBAT]: [
    new SpeciesEvolution(
      SpeciesId.CROBAT,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120)],
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.ODDISH]: [new SpeciesEvolution(SpeciesId.GLOOM, 21, null, null)],
  [SpeciesId.GLOOM]: [
    new SpeciesEvolution(SpeciesId.VILEPLUME, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(SpeciesId.BELLOSSOM, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.PARAS]: [new SpeciesEvolution(SpeciesId.PARASECT, 24, null, null)],
  [SpeciesId.VENONAT]: [new SpeciesEvolution(SpeciesId.VENOMOTH, 31, null, null)],
  [SpeciesId.DIGLETT]: [new SpeciesEvolution(SpeciesId.DUGTRIO, 26, null, null)],
  [SpeciesId.MEOWTH]: [new SpeciesFormEvolution(SpeciesId.PERSIAN, "", "", 28, null, null)],
  [SpeciesId.PSYDUCK]: [new SpeciesEvolution(SpeciesId.GOLDUCK, 33, null, null)],
  [SpeciesId.MANKEY]: [new SpeciesEvolution(SpeciesId.PRIMEAPE, 28, null, null)],
  [SpeciesId.PRIMEAPE]: [
    new SpeciesEvolution(
      SpeciesId.ANNIHILAPE,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.RAGE_FIST)],
      ANNIHILAPE_EVO_LEVEL,
    ),
  ],
  [SpeciesId.GROWLITHE]: [
    new SpeciesEvolution(SpeciesId.ARCANINE, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.POLIWAG]: [new SpeciesEvolution(SpeciesId.POLIWHIRL, 25, null, null)],
  [SpeciesId.POLIWHIRL]: [
    new SpeciesEvolution(SpeciesId.POLIWRATH, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(SpeciesId.POLITOED, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.ABRA]: [new SpeciesEvolution(SpeciesId.KADABRA, 16, null, null)],
  [SpeciesId.KADABRA]: [
    new SpeciesEvolution(SpeciesId.ALAKAZAM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.MACHOP]: [new SpeciesEvolution(SpeciesId.MACHOKE, 28, null, null)],
  [SpeciesId.MACHOKE]: [
    new SpeciesEvolution(SpeciesId.MACHAMP, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.BELLSPROUT]: [new SpeciesEvolution(SpeciesId.WEEPINBELL, 21, null, null)],
  [SpeciesId.WEEPINBELL]: [
    new SpeciesEvolution(SpeciesId.VICTREEBEL, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.TENTACOOL]: [new SpeciesEvolution(SpeciesId.TENTACRUEL, 30, null, null)],
  [SpeciesId.GEODUDE]: [new SpeciesEvolution(SpeciesId.GRAVELER, 25, null, null)],
  [SpeciesId.GRAVELER]: [
    new SpeciesEvolution(SpeciesId.GOLEM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.PONYTA]: [new SpeciesEvolution(SpeciesId.RAPIDASH, 40, null, null)],
  [SpeciesId.SLOWPOKE]: [
    new SpeciesEvolution(SpeciesId.SLOWBRO, 37, null, null),
    new SpeciesEvolution(SpeciesId.SLOWKING, 1, EvolutionItem.LINKING_CORD, null, SLOWPOKE_FAMILY_EVO_LEVEL),
  ],
  [SpeciesId.MAGNEMITE]: [new SpeciesEvolution(SpeciesId.MAGNETON, 30, null, null)],
  [SpeciesId.MAGNETON]: [
    new SpeciesEvolution(SpeciesId.MAGNEZONE, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.DODUO]: [new SpeciesEvolution(SpeciesId.DODRIO, 31, null, null)],
  [SpeciesId.SEEL]: [new SpeciesEvolution(SpeciesId.DEWGONG, 34, null, null)],
  [SpeciesId.GRIMER]: [new SpeciesEvolution(SpeciesId.MUK, 38, null, null)],
  [SpeciesId.SHELLDER]: [
    new SpeciesEvolution(SpeciesId.CLOYSTER, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.GASTLY]: [new SpeciesEvolution(SpeciesId.HAUNTER, 25, null, null)],
  [SpeciesId.HAUNTER]: [
    new SpeciesEvolution(SpeciesId.GENGAR, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.ONIX]: [
    new SpeciesEvolution(SpeciesId.STEELIX, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.DROWZEE]: [new SpeciesEvolution(SpeciesId.HYPNO, 26, null, null)],
  [SpeciesId.KRABBY]: [new SpeciesEvolution(SpeciesId.KINGLER, 28, null, null)],
  [SpeciesId.VOLTORB]: [new SpeciesEvolution(SpeciesId.ELECTRODE, 30, null, null)],
  [SpeciesId.EXEGGCUTE]: [
    new SpeciesEvolution(SpeciesId.EXEGGUTOR, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(SpeciesId.ALOLA_EXEGGUTOR, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.CUBONE]: [
    new SpeciesEvolution(SpeciesId.MAROWAK, 28, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.ALOLA_MAROWAK, 28, null, [new NightEvolutionCondition()]),
  ],
  /** Tyrogue is from gen 2 */
  [SpeciesId.TYROGUE]: [
    /**
     * Custom: Evolves into Hitmonlee, Hitmonchan or Hitmontop at level 20
     * if it knows Low Sweep, Mach Punch, or Rapid Spin, respectively.
     * If Tyrogue knows multiple of these moves, its evolution is based on
     * the first qualifying move in its moveset.
     */
    new SpeciesEvolution(SpeciesId.HITMONLEE, 20, null, [new MoveKnownEvoCondition(MoveId.LOW_SWEEP)]),
    new SpeciesEvolution(SpeciesId.HITMONCHAN, 20, null, [new MoveKnownEvoCondition(MoveId.MACH_PUNCH)]),
    new SpeciesEvolution(SpeciesId.HITMONTOP, 20, null, [new MoveKnownEvoCondition(MoveId.RAPID_SPIN)]),
  ],
  [SpeciesId.LICKITUNG]: [
    new SpeciesEvolution(
      SpeciesId.LICKILICKY,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.ROLLOUT)],
      LICKILICKY_EVO_LEVEL,
    ),
  ],
  [SpeciesId.KOFFING]: [
    new SpeciesEvolution(SpeciesId.WEEZING, 35, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.GALAR_WEEZING, 35, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.RHYHORN]: [new SpeciesEvolution(SpeciesId.RHYDON, 42, null, null)],
  [SpeciesId.RHYDON]: [
    new SpeciesEvolution(SpeciesId.RHYPERIOR, 1, EvolutionItem.PROTECTOR, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  /** Happiny is from gen 4 */
  [SpeciesId.HAPPINY]: [
    new SpeciesEvolution(
      SpeciesId.CHANSEY,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(70)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.CHANSEY]: [
    new SpeciesEvolution(
      SpeciesId.BLISSEY,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(200)],
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.TANGELA]: [
    new SpeciesEvolution(
      SpeciesId.TANGROWTH,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.ANCIENT_POWER)],
      TANGROWTH_EVO_LEVEL,
    ),
  ],
  [SpeciesId.HORSEA]: [new SpeciesEvolution(SpeciesId.SEADRA, 32, null, null)],
  [SpeciesId.SEADRA]: [
    new SpeciesEvolution(SpeciesId.KINGDRA, 1, EvolutionItem.DRAGON_SCALE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.GOLDEEN]: [new SpeciesEvolution(SpeciesId.SEAKING, 33, null, null)],
  [SpeciesId.STARYU]: [
    new SpeciesEvolution(SpeciesId.STARMIE, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Mime Jr is from gen 4 */
  [SpeciesId.MIME_JR]: [
    new SpeciesEvolution(
      SpeciesId.MR_MIME,
      1,
      null,
      [new DayEvolutionCondition(), new MoveKnownEvoCondition(MoveId.MIMIC)],
      MR_MIME_EVO_LEVEL,
    ),
    new SpeciesEvolution(
      SpeciesId.GALAR_MR_MIME,
      1,
      null,
      [new NightEvolutionCondition(), new MoveKnownEvoCondition(MoveId.MIMIC)],
      MR_MIME_EVO_LEVEL,
    ),
  ],
  /** Galar Mr Mime is from gen 8 */
  [SpeciesId.GALAR_MR_MIME]: [new SpeciesEvolution(SpeciesId.MR_RIME, 42, null, null)],
  [SpeciesId.SCYTHER]: [
    new SpeciesEvolution(SpeciesId.SCIZOR, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(SpeciesId.KLEAVOR, 1, EvolutionItem.BLACK_AUGURITE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Smoochum is from gen 2 */
  [SpeciesId.SMOOCHUM]: [new SpeciesEvolution(SpeciesId.JYNX, 30, null, null)],
  /** Elekid is from gen 2 */
  [SpeciesId.ELEKID]: [new SpeciesEvolution(SpeciesId.ELECTABUZZ, 30, null, null)],
  [SpeciesId.ELECTABUZZ]: [
    new SpeciesEvolution(SpeciesId.ELECTIVIRE, 1, EvolutionItem.ELECTIRIZER, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  /** Magby is from gen 2 */
  [SpeciesId.MAGBY]: [new SpeciesEvolution(SpeciesId.MAGMAR, 30, null, null)],
  [SpeciesId.MAGMAR]: [
    new SpeciesEvolution(SpeciesId.MAGMORTAR, 1, EvolutionItem.MAGMARIZER, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.MAGIKARP]: [new SpeciesEvolution(SpeciesId.GYARADOS, 20, null, null)],
  /** Keeping all of Eevee's alt level's the same for consistency */
  [SpeciesId.EEVEE]: [
    new SpeciesFormEvolution(
      SpeciesId.SYLVEON,
      "",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new TypeKnownEvoCondition(ElementalType.FAIRY)],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.SYLVEON,
      "partner",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new TypeKnownEvoCondition(ElementalType.FAIRY)],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ESPEON,
      "",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new DayEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ESPEON,
      "partner",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new DayEvolutionCondition()],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.UMBREON,
      "",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new NightEvolutionCondition()],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.UMBREON,
      "partner",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new NightEvolutionCondition()],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(SpeciesId.VAPOREON, "", "", 1, EvolutionItem.WATER_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(
      SpeciesId.VAPOREON,
      "partner",
      "",
      1,
      EvolutionItem.WATER_STONE,
      null,
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(SpeciesId.JOLTEON, "", "", 1, EvolutionItem.THUNDER_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(
      SpeciesId.JOLTEON,
      "partner",
      "",
      1,
      EvolutionItem.THUNDER_STONE,
      null,
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(SpeciesId.FLAREON, "", "", 1, EvolutionItem.FIRE_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(
      SpeciesId.FLAREON,
      "partner",
      "",
      1,
      EvolutionItem.FIRE_STONE,
      null,
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(SpeciesId.LEAFEON, "", "", 1, EvolutionItem.LEAF_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(
      SpeciesId.LEAFEON,
      "partner",
      "",
      1,
      EvolutionItem.LEAF_STONE,
      null,
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(SpeciesId.GLACEON, "", "", 1, EvolutionItem.ICE_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(
      SpeciesId.GLACEON,
      "partner",
      "",
      1,
      EvolutionItem.ICE_STONE,
      null,
      EEVEE_FAMILY_EVO_LEVEL,
    ),
  ],
  [SpeciesId.PORYGON]: [
    new SpeciesEvolution(SpeciesId.PORYGON2, 1, EvolutionItem.UPGRADE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Porygon2 is from gen 2 */
  [SpeciesId.PORYGON2]: [
    new SpeciesEvolution(SpeciesId.PORYGON_Z, 1, EvolutionItem.DUBIOUS_DISC, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.OMANYTE]: [new SpeciesEvolution(SpeciesId.OMASTAR, 40, null, null)],
  [SpeciesId.KABUTO]: [new SpeciesEvolution(SpeciesId.KABUTOPS, 40, null, null)],
  [SpeciesId.MUNCHLAX]: [
    new SpeciesEvolution(
      SpeciesId.SNORLAX,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120)],
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.DRATINI]: [new SpeciesEvolution(SpeciesId.DRAGONAIR, 30, null, null)],
  [SpeciesId.DRAGONAIR]: [new SpeciesEvolution(SpeciesId.DRAGONITE, 55, null, null)],
};
