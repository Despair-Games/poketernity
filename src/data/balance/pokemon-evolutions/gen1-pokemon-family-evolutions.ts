import { EvolutionItem } from "#enums/evolution-item";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
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
  [Species.BULBASAUR]: [new SpeciesEvolution(Species.IVYSAUR, 16, null, null)],
  [Species.IVYSAUR]: [new SpeciesEvolution(Species.VENUSAUR, 32, null, null)],
  [Species.CHARMANDER]: [new SpeciesEvolution(Species.CHARMELEON, 16, null, null)],
  [Species.CHARMELEON]: [new SpeciesEvolution(Species.CHARIZARD, 36, null, null)],
  [Species.SQUIRTLE]: [new SpeciesEvolution(Species.WARTORTLE, 16, null, null)],
  [Species.WARTORTLE]: [new SpeciesEvolution(Species.BLASTOISE, 36, null, null)],
  [Species.CATERPIE]: [new SpeciesEvolution(Species.METAPOD, 7, null, null)],
  [Species.METAPOD]: [new SpeciesEvolution(Species.BUTTERFREE, 10, null, null)],
  [Species.WEEDLE]: [new SpeciesEvolution(Species.KAKUNA, 7, null, null)],
  [Species.KAKUNA]: [new SpeciesEvolution(Species.BEEDRILL, 10, null, null)],
  [Species.PIDGEY]: [new SpeciesEvolution(Species.PIDGEOTTO, 18, null, null)],
  [Species.PIDGEOTTO]: [new SpeciesEvolution(Species.PIDGEOT, 36, null, null)],
  [Species.RATTATA]: [new SpeciesEvolution(Species.RATICATE, 20, null, null)],
  [Species.SPEAROW]: [new SpeciesEvolution(Species.FEAROW, 20, null, null)],
  [Species.EKANS]: [new SpeciesEvolution(Species.ARBOK, 22, null, null)],
  /** Pichu is from gen 2 */
  [Species.PICHU]: [
    new SpeciesFormEvolution(
      Species.PIKACHU,
      "spiky",
      "partner",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(90)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.PIKACHU,
      "",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(90)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  /** Custom method of evolving into Alolan Raichu */
  [Species.PIKACHU]: [
    new SpeciesFormEvolution(Species.RAICHU, "", "", 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(
      Species.RAICHU,
      "partner",
      "",
      1,
      EvolutionItem.THUNDER_STONE,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(Species.ALOLA_RAICHU, "", "", 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesFormEvolution(
      Species.ALOLA_RAICHU,
      "partner",
      "",
      1,
      EvolutionItem.SHINY_STONE,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.SANDSHREW]: [new SpeciesEvolution(Species.SANDSLASH, 22, null, null)],
  [Species.NIDORAN_F]: [new SpeciesEvolution(Species.NIDORINA, 16, null, null)],
  [Species.NIDORINA]: [
    new SpeciesEvolution(Species.NIDOQUEEN, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.NIDORAN_M]: [new SpeciesEvolution(Species.NIDORINO, 16, null, null)],
  [Species.NIDORINO]: [
    new SpeciesEvolution(Species.NIDOKING, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Cleffa is from gen 2 */
  [Species.CLEFFA]: [
    new SpeciesEvolution(
      Species.CLEFAIRY,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(70)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.CLEFAIRY]: [
    new SpeciesEvolution(Species.CLEFABLE, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],

  [Species.VULPIX]: [
    new SpeciesEvolution(Species.NINETALES, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Igglybuff is from gen 2 */
  [Species.IGGLYBUFF]: [
    new SpeciesEvolution(
      Species.JIGGLYPUFF,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(70)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.JIGGLYPUFF]: [
    new SpeciesEvolution(Species.WIGGLYTUFF, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ZUBAT]: [new SpeciesEvolution(Species.GOLBAT, 22, null, null)],
  [Species.GOLBAT]: [
    new SpeciesEvolution(Species.CROBAT, 1, null, [new SpeciesFriendshipEvolutionCondition(120)], HAPPINESS_EVO_LEVEL),
  ],
  [Species.ODDISH]: [new SpeciesEvolution(Species.GLOOM, 21, null, null)],
  [Species.GLOOM]: [
    new SpeciesEvolution(Species.VILEPLUME, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.BELLOSSOM, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PARAS]: [new SpeciesEvolution(Species.PARASECT, 24, null, null)],
  [Species.VENONAT]: [new SpeciesEvolution(Species.VENOMOTH, 31, null, null)],
  [Species.DIGLETT]: [new SpeciesEvolution(Species.DUGTRIO, 26, null, null)],
  [Species.MEOWTH]: [new SpeciesFormEvolution(Species.PERSIAN, "", "", 28, null, null)],
  [Species.PSYDUCK]: [new SpeciesEvolution(Species.GOLDUCK, 33, null, null)],
  [Species.MANKEY]: [new SpeciesEvolution(Species.PRIMEAPE, 28, null, null)],
  [Species.PRIMEAPE]: [
    new SpeciesEvolution(
      Species.ANNIHILAPE,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.RAGE_FIST)],
      ANNIHILAPE_EVO_LEVEL,
    ),
  ],
  [Species.GROWLITHE]: [
    new SpeciesEvolution(Species.ARCANINE, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.POLIWAG]: [new SpeciesEvolution(Species.POLIWHIRL, 25, null, null)],
  [Species.POLIWHIRL]: [
    new SpeciesEvolution(Species.POLIWRATH, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.POLITOED, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ABRA]: [new SpeciesEvolution(Species.KADABRA, 16, null, null)],
  [Species.KADABRA]: [
    new SpeciesEvolution(Species.ALAKAZAM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.MACHOP]: [new SpeciesEvolution(Species.MACHOKE, 28, null, null)],
  [Species.MACHOKE]: [
    new SpeciesEvolution(Species.MACHAMP, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.BELLSPROUT]: [new SpeciesEvolution(Species.WEEPINBELL, 21, null, null)],
  [Species.WEEPINBELL]: [
    new SpeciesEvolution(Species.VICTREEBEL, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.TENTACOOL]: [new SpeciesEvolution(Species.TENTACRUEL, 30, null, null)],
  [Species.GEODUDE]: [new SpeciesEvolution(Species.GRAVELER, 25, null, null)],
  [Species.GRAVELER]: [
    new SpeciesEvolution(Species.GOLEM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PONYTA]: [new SpeciesEvolution(Species.RAPIDASH, 40, null, null)],
  [Species.SLOWPOKE]: [
    new SpeciesEvolution(Species.SLOWBRO, 37, null, null),
    new SpeciesEvolution(Species.SLOWKING, 1, EvolutionItem.LINKING_CORD, null, SLOWPOKE_FAMILY_EVO_LEVEL),
  ],
  [Species.MAGNEMITE]: [new SpeciesEvolution(Species.MAGNETON, 30, null, null)],
  [Species.MAGNETON]: [
    new SpeciesEvolution(Species.MAGNEZONE, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.DODUO]: [new SpeciesEvolution(Species.DODRIO, 31, null, null)],
  [Species.SEEL]: [new SpeciesEvolution(Species.DEWGONG, 34, null, null)],
  [Species.GRIMER]: [new SpeciesEvolution(Species.MUK, 38, null, null)],
  [Species.SHELLDER]: [
    new SpeciesEvolution(Species.CLOYSTER, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.GASTLY]: [new SpeciesEvolution(Species.HAUNTER, 25, null, null)],
  [Species.HAUNTER]: [
    new SpeciesEvolution(Species.GENGAR, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ONIX]: [new SpeciesEvolution(Species.STEELIX, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.DROWZEE]: [new SpeciesEvolution(Species.HYPNO, 26, null, null)],
  [Species.KRABBY]: [new SpeciesEvolution(Species.KINGLER, 28, null, null)],
  [Species.VOLTORB]: [new SpeciesEvolution(Species.ELECTRODE, 30, null, null)],
  [Species.EXEGGCUTE]: [
    new SpeciesEvolution(Species.EXEGGUTOR, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.ALOLA_EXEGGUTOR, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CUBONE]: [
    new SpeciesEvolution(Species.MAROWAK, 28, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(Species.ALOLA_MAROWAK, 28, null, [new NightEvolutionCondition()]),
  ],
  /** Tyrogue is from gen 2 */
  [Species.TYROGUE]: [
    /**
     * Custom: Evolves into Hitmonlee, Hitmonchan or Hitmontop at level 20
     * if it knows Low Sweep, Mach Punch, or Rapid Spin, respectively.
     * If Tyrogue knows multiple of these moves, its evolution is based on
     * the first qualifying move in its moveset.
     */
    new SpeciesEvolution(Species.HITMONLEE, 20, null, [new MoveKnownEvoCondition(MoveId.LOW_SWEEP)]),
    new SpeciesEvolution(Species.HITMONCHAN, 20, null, [new MoveKnownEvoCondition(MoveId.MACH_PUNCH)]),
    new SpeciesEvolution(Species.HITMONTOP, 20, null, [new MoveKnownEvoCondition(MoveId.RAPID_SPIN)]),
  ],
  [Species.LICKITUNG]: [
    new SpeciesEvolution(
      Species.LICKILICKY,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.ROLLOUT)],
      LICKILICKY_EVO_LEVEL,
    ),
  ],
  [Species.KOFFING]: [
    new SpeciesEvolution(Species.WEEZING, 35, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(Species.GALAR_WEEZING, 35, null, [new NightEvolutionCondition()]),
  ],
  [Species.RHYHORN]: [new SpeciesEvolution(Species.RHYDON, 42, null, null)],
  [Species.RHYDON]: [
    new SpeciesEvolution(Species.RHYPERIOR, 1, EvolutionItem.PROTECTOR, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  /** Happiny is from gen 4 */
  [Species.HAPPINY]: [
    new SpeciesEvolution(
      Species.CHANSEY,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(70)],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.CHANSEY]: [
    new SpeciesEvolution(Species.BLISSEY, 1, null, [new SpeciesFriendshipEvolutionCondition(200)], HAPPINESS_EVO_LEVEL),
  ],
  [Species.TANGELA]: [
    new SpeciesEvolution(
      Species.TANGROWTH,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.ANCIENT_POWER)],
      TANGROWTH_EVO_LEVEL,
    ),
  ],
  [Species.HORSEA]: [new SpeciesEvolution(Species.SEADRA, 32, null, null)],
  [Species.SEADRA]: [
    new SpeciesEvolution(Species.KINGDRA, 1, EvolutionItem.DRAGON_SCALE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.GOLDEEN]: [new SpeciesEvolution(Species.SEAKING, 33, null, null)],
  [Species.STARYU]: [new SpeciesEvolution(Species.STARMIE, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  /** Mime Jr is from gen 4 */
  [Species.MIME_JR]: [
    new SpeciesEvolution(
      Species.MR_MIME,
      1,
      null,
      [new DayEvolutionCondition(), new MoveKnownEvoCondition(MoveId.MIMIC)],
      MR_MIME_EVO_LEVEL,
    ),
    new SpeciesEvolution(
      Species.GALAR_MR_MIME,
      1,
      null,
      [new NightEvolutionCondition(), new MoveKnownEvoCondition(MoveId.MIMIC)],
      MR_MIME_EVO_LEVEL,
    ),
  ],
  /** Galar Mr Mime is from gen 8 */
  [Species.GALAR_MR_MIME]: [new SpeciesEvolution(Species.MR_RIME, 42, null, null)],
  [Species.SCYTHER]: [
    new SpeciesEvolution(Species.SCIZOR, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.KLEAVOR, 1, EvolutionItem.BLACK_AUGURITE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Smoochum is from gen 2 */
  [Species.SMOOCHUM]: [new SpeciesEvolution(Species.JYNX, 30, null, null)],
  /** Elekid is from gen 2 */
  [Species.ELEKID]: [new SpeciesEvolution(Species.ELECTABUZZ, 30, null, null)],
  [Species.ELECTABUZZ]: [
    new SpeciesEvolution(Species.ELECTIVIRE, 1, EvolutionItem.ELECTIRIZER, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  /** Magby is from gen 2 */
  [Species.MAGBY]: [new SpeciesEvolution(Species.MAGMAR, 30, null, null)],
  [Species.MAGMAR]: [
    new SpeciesEvolution(Species.MAGMORTAR, 1, EvolutionItem.MAGMARIZER, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [Species.MAGIKARP]: [new SpeciesEvolution(Species.GYARADOS, 20, null, null)],
  /** Keeping all of Eevee's alt level's the same for consistency */
  [Species.EEVEE]: [
    new SpeciesFormEvolution(
      Species.SYLVEON,
      "",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new TypeKnownEvoCondition(ElementalType.FAIRY)],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.SYLVEON,
      "partner",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new TypeKnownEvoCondition(ElementalType.FAIRY)],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ESPEON,
      "",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new DayEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ESPEON,
      "partner",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new DayEvolutionCondition()],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.UMBREON,
      "",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new NightEvolutionCondition()],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.UMBREON,
      "partner",
      "",
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new NightEvolutionCondition()],
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(Species.VAPOREON, "", "", 1, EvolutionItem.WATER_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(
      Species.VAPOREON,
      "partner",
      "",
      1,
      EvolutionItem.WATER_STONE,
      null,
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(Species.JOLTEON, "", "", 1, EvolutionItem.THUNDER_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(
      Species.JOLTEON,
      "partner",
      "",
      1,
      EvolutionItem.THUNDER_STONE,
      null,
      EEVEE_FAMILY_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(Species.FLAREON, "", "", 1, EvolutionItem.FIRE_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(Species.FLAREON, "partner", "", 1, EvolutionItem.FIRE_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(Species.LEAFEON, "", "", 1, EvolutionItem.LEAF_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(Species.LEAFEON, "partner", "", 1, EvolutionItem.LEAF_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(Species.GLACEON, "", "", 1, EvolutionItem.ICE_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
    new SpeciesFormEvolution(Species.GLACEON, "partner", "", 1, EvolutionItem.ICE_STONE, null, EEVEE_FAMILY_EVO_LEVEL),
  ],
  [Species.PORYGON]: [new SpeciesEvolution(Species.PORYGON2, 1, EvolutionItem.UPGRADE, null, GENERIC_ITEM_EVO_LEVEL)],
  /** Porygon2 is from gen 2 */
  [Species.PORYGON2]: [
    new SpeciesEvolution(Species.PORYGON_Z, 1, EvolutionItem.DUBIOUS_DISC, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [Species.OMANYTE]: [new SpeciesEvolution(Species.OMASTAR, 40, null, null)],
  [Species.KABUTO]: [new SpeciesEvolution(Species.KABUTOPS, 40, null, null)],
  [Species.MUNCHLAX]: [
    new SpeciesEvolution(Species.SNORLAX, 1, null, [new SpeciesFriendshipEvolutionCondition(120)], HAPPINESS_EVO_LEVEL),
  ],
  [Species.DRATINI]: [new SpeciesEvolution(Species.DRAGONAIR, 30, null, null)],
  [Species.DRAGONAIR]: [new SpeciesEvolution(Species.DRAGONITE, 55, null, null)],
};
