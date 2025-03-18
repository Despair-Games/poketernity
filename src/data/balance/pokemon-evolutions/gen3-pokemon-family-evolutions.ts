import { Species } from "#enums/species";
import {
  DayEvolutionCondition,
  FemaleEvolutionCondition,
  MaleEvolutionCondition,
  NightEvolutionCondition,
  type PokemonEvolutions,
  ShedinjaEvoCondition,
  SpeciesEvolution,
  SpeciesFriendshipEvolutionCondition,
} from "#app/data/pokemon-evolutions";
import { EvolutionItem } from "#enums/evolution-item";
import {
  ADVANCED_ITEM_EVO_LEVEL,
  BABY_HAPPINESS_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";

export const gen3pokemonFamilyEvolutions: PokemonEvolutions = {
  [Species.TREECKO]: [new SpeciesEvolution(Species.GROVYLE, 16, null, null)],
  [Species.GROVYLE]: [new SpeciesEvolution(Species.SCEPTILE, 36, null, null)],
  [Species.TORCHIC]: [new SpeciesEvolution(Species.COMBUSKEN, 16, null, null)],
  [Species.COMBUSKEN]: [new SpeciesEvolution(Species.BLAZIKEN, 36, null, null)],
  [Species.MUDKIP]: [new SpeciesEvolution(Species.MARSHTOMP, 16, null, null)],
  [Species.MARSHTOMP]: [new SpeciesEvolution(Species.SWAMPERT, 36, null, null)],
  [Species.POOCHYENA]: [new SpeciesEvolution(Species.MIGHTYENA, 18, null, null)],
  [Species.ZIGZAGOON]: [new SpeciesEvolution(Species.LINOONE, 20, null, null)],
  /** Custom: Wurmple evolves based on time of day instead of by personality value */
  [Species.WURMPLE]: [
    new SpeciesEvolution(Species.SILCOON, 7, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(Species.CASCOON, 7, null, [new NightEvolutionCondition()]),
  ],
  [Species.SILCOON]: [new SpeciesEvolution(Species.BEAUTIFLY, 10, null, null)],
  [Species.CASCOON]: [new SpeciesEvolution(Species.DUSTOX, 10, null, null)],
  [Species.LOTAD]: [new SpeciesEvolution(Species.LOMBRE, 14, null, null)],
  [Species.LOMBRE]: [
    new SpeciesEvolution(Species.LUDICOLO, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.SEEDOT]: [new SpeciesEvolution(Species.NUZLEAF, 14, null, null)],
  [Species.NUZLEAF]: [new SpeciesEvolution(Species.SHIFTRY, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.TAILLOW]: [new SpeciesEvolution(Species.SWELLOW, 22, null, null)],
  [Species.WINGULL]: [new SpeciesEvolution(Species.PELIPPER, 25, null, null)],
  [Species.RALTS]: [new SpeciesEvolution(Species.KIRLIA, 20, null, null)],
  /** Custom: Gallade evolves by level instead of dawn stone */
  [Species.KIRLIA]: [
    new SpeciesEvolution(Species.GARDEVOIR, 30, null, [new FemaleEvolutionCondition()]),
    new SpeciesEvolution(Species.GALLADE, 30, null, [new MaleEvolutionCondition()]),
  ],
  [Species.SURSKIT]: [new SpeciesEvolution(Species.MASQUERAIN, 22, null, null)],
  [Species.SHROOMISH]: [new SpeciesEvolution(Species.BRELOOM, 23, null, null)],
  [Species.SLAKOTH]: [new SpeciesEvolution(Species.VIGOROTH, 18, null, null)],
  [Species.VIGOROTH]: [new SpeciesEvolution(Species.SLAKING, 36, null, null)],
  [Species.NINCADA]: [
    new SpeciesEvolution(Species.NINJASK, 20, null, null),
    new SpeciesEvolution(Species.SHEDINJA, 20, null, [new ShedinjaEvoCondition()]),
  ],
  [Species.WHISMUR]: [new SpeciesEvolution(Species.LOUDRED, 20, null, null)],
  [Species.LOUDRED]: [new SpeciesEvolution(Species.EXPLOUD, 40, null, null)],
  [Species.MAKUHITA]: [new SpeciesEvolution(Species.HARIYAMA, 24, null, null)],
  [Species.NOSEPASS]: [
    new SpeciesEvolution(Species.PROBOPASS, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.SKITTY]: [new SpeciesEvolution(Species.DELCATTY, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.ARON]: [new SpeciesEvolution(Species.LAIRON, 32, null, null)],
  [Species.LAIRON]: [new SpeciesEvolution(Species.AGGRON, 42, null, null)],
  [Species.MEDITITE]: [new SpeciesEvolution(Species.MEDICHAM, 37, null, null)],
  [Species.ELECTRIKE]: [new SpeciesEvolution(Species.MANECTRIC, 26, null, null)],
  /** Budew is from Gen 4 */
  [Species.BUDEW]: [
    new SpeciesEvolution(
      Species.ROSELIA,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(70), new DayEvolutionCondition()],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.ROSELIA]: [
    new SpeciesEvolution(Species.ROSERADE, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.GULPIN]: [new SpeciesEvolution(Species.SWALOT, 26, null, null)],
  [Species.CARVANHA]: [new SpeciesEvolution(Species.SHARPEDO, 30, null, null)],
  [Species.WAILMER]: [new SpeciesEvolution(Species.WAILORD, 40, null, null)],
  [Species.NUMEL]: [new SpeciesEvolution(Species.CAMERUPT, 33, null, null)],
  [Species.SPOINK]: [new SpeciesEvolution(Species.GRUMPIG, 32, null, null)],
  [Species.TRAPINCH]: [new SpeciesEvolution(Species.VIBRAVA, 35, null, null)],
  [Species.VIBRAVA]: [new SpeciesEvolution(Species.FLYGON, 45, null, null)],
  [Species.CACNEA]: [new SpeciesEvolution(Species.CACTURNE, 32, null, null)],
  [Species.SWABLU]: [new SpeciesEvolution(Species.ALTARIA, 35, null, null)],
  [Species.BARBOACH]: [new SpeciesEvolution(Species.WHISCASH, 30, null, null)],
  [Species.CORPHISH]: [new SpeciesEvolution(Species.CRAWDAUNT, 30, null, null)],
  [Species.BALTOY]: [new SpeciesEvolution(Species.CLAYDOL, 36, null, null)],
  [Species.LILEEP]: [new SpeciesEvolution(Species.CRADILY, 40, null, null)],
  [Species.ANORITH]: [new SpeciesEvolution(Species.ARMALDO, 40, null, null)],
  [Species.FEEBAS]: [new SpeciesEvolution(Species.MILOTIC, 1, EvolutionItem.PRISM_SCALE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.SHUPPET]: [new SpeciesEvolution(Species.BANETTE, 37, null, null)],
  [Species.DUSKULL]: [new SpeciesEvolution(Species.DUSCLOPS, 37, null, null)],
  [Species.DUSCLOPS]: [
    new SpeciesEvolution(Species.DUSKNOIR, 1, EvolutionItem.REAPER_CLOTH, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  /** Chingling is from Gen 4 */
  [Species.CHINGLING]: [
    new SpeciesEvolution(
      Species.CHIMECHO,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(90), new NightEvolutionCondition()],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  /** Custom: Froslass evolves by level instead of Dawn Stone */
  [Species.SNORUNT]: [
    new SpeciesEvolution(Species.GLALIE, 42, null, [new MaleEvolutionCondition()]),
    new SpeciesEvolution(Species.FROSLASS, 42, null, [new FemaleEvolutionCondition()]),
  ],
  [Species.SPHEAL]: [new SpeciesEvolution(Species.SEALEO, 32, null, null)],
  [Species.SEALEO]: [new SpeciesEvolution(Species.WALREIN, 44, null, null)],
  /** Custom: Clamperl evolves based on gender */
  [Species.CLAMPERL]: [
    new SpeciesEvolution(
      Species.HUNTAIL,
      1,
      EvolutionItem.LINKING_CORD /* Deep Sea Tooth */,
      [new MaleEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesEvolution(
      Species.GOREBYSS,
      1,
      EvolutionItem.LINKING_CORD /* Deep Sea Scale */,
      [new FemaleEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.BAGON]: [new SpeciesEvolution(Species.SHELGON, 30, null, null)],
  [Species.SHELGON]: [new SpeciesEvolution(Species.SALAMENCE, 50, null, null)],
  [Species.BELDUM]: [new SpeciesEvolution(Species.METANG, 20, null, null)],
  [Species.METANG]: [new SpeciesEvolution(Species.METAGROSS, 45, null, null)],
};
