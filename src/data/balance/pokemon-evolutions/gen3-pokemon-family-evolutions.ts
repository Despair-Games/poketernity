import { SpeciesId } from "#enums/species-id";
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
  [SpeciesId.TREECKO]: [new SpeciesEvolution(SpeciesId.GROVYLE, 16, null, null)],
  [SpeciesId.GROVYLE]: [new SpeciesEvolution(SpeciesId.SCEPTILE, 36, null, null)],
  [SpeciesId.TORCHIC]: [new SpeciesEvolution(SpeciesId.COMBUSKEN, 16, null, null)],
  [SpeciesId.COMBUSKEN]: [new SpeciesEvolution(SpeciesId.BLAZIKEN, 36, null, null)],
  [SpeciesId.MUDKIP]: [new SpeciesEvolution(SpeciesId.MARSHTOMP, 16, null, null)],
  [SpeciesId.MARSHTOMP]: [new SpeciesEvolution(SpeciesId.SWAMPERT, 36, null, null)],
  [SpeciesId.POOCHYENA]: [new SpeciesEvolution(SpeciesId.MIGHTYENA, 18, null, null)],
  [SpeciesId.ZIGZAGOON]: [new SpeciesEvolution(SpeciesId.LINOONE, 20, null, null)],
  /** Custom: Wurmple evolves based on time of day instead of by personality value */
  [SpeciesId.WURMPLE]: [
    new SpeciesEvolution(SpeciesId.SILCOON, 7, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.CASCOON, 7, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.SILCOON]: [new SpeciesEvolution(SpeciesId.BEAUTIFLY, 10, null, null)],
  [SpeciesId.CASCOON]: [new SpeciesEvolution(SpeciesId.DUSTOX, 10, null, null)],
  [SpeciesId.LOTAD]: [new SpeciesEvolution(SpeciesId.LOMBRE, 14, null, null)],
  [SpeciesId.LOMBRE]: [
    new SpeciesEvolution(SpeciesId.LUDICOLO, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.SEEDOT]: [new SpeciesEvolution(SpeciesId.NUZLEAF, 14, null, null)],
  [SpeciesId.NUZLEAF]: [
    new SpeciesEvolution(SpeciesId.SHIFTRY, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.TAILLOW]: [new SpeciesEvolution(SpeciesId.SWELLOW, 22, null, null)],
  [SpeciesId.WINGULL]: [new SpeciesEvolution(SpeciesId.PELIPPER, 25, null, null)],
  [SpeciesId.RALTS]: [new SpeciesEvolution(SpeciesId.KIRLIA, 20, null, null)],
  /** Custom: Gallade evolves by level instead of dawn stone */
  [SpeciesId.KIRLIA]: [
    new SpeciesEvolution(SpeciesId.GARDEVOIR, 30, null, [new FemaleEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.GALLADE, 30, null, [new MaleEvolutionCondition()]),
  ],
  [SpeciesId.SURSKIT]: [new SpeciesEvolution(SpeciesId.MASQUERAIN, 22, null, null)],
  [SpeciesId.SHROOMISH]: [new SpeciesEvolution(SpeciesId.BRELOOM, 23, null, null)],
  [SpeciesId.SLAKOTH]: [new SpeciesEvolution(SpeciesId.VIGOROTH, 18, null, null)],
  [SpeciesId.VIGOROTH]: [new SpeciesEvolution(SpeciesId.SLAKING, 36, null, null)],
  [SpeciesId.NINCADA]: [
    new SpeciesEvolution(SpeciesId.NINJASK, 20, null, null),
    new SpeciesEvolution(SpeciesId.SHEDINJA, 20, null, [new ShedinjaEvoCondition()]),
  ],
  [SpeciesId.WHISMUR]: [new SpeciesEvolution(SpeciesId.LOUDRED, 20, null, null)],
  [SpeciesId.LOUDRED]: [new SpeciesEvolution(SpeciesId.EXPLOUD, 40, null, null)],
  [SpeciesId.MAKUHITA]: [new SpeciesEvolution(SpeciesId.HARIYAMA, 24, null, null)],
  [SpeciesId.NOSEPASS]: [
    new SpeciesEvolution(SpeciesId.PROBOPASS, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.SKITTY]: [
    new SpeciesEvolution(SpeciesId.DELCATTY, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.ARON]: [new SpeciesEvolution(SpeciesId.LAIRON, 32, null, null)],
  [SpeciesId.LAIRON]: [new SpeciesEvolution(SpeciesId.AGGRON, 42, null, null)],
  [SpeciesId.MEDITITE]: [new SpeciesEvolution(SpeciesId.MEDICHAM, 37, null, null)],
  [SpeciesId.ELECTRIKE]: [new SpeciesEvolution(SpeciesId.MANECTRIC, 26, null, null)],
  /** Budew is from Gen 4 */
  [SpeciesId.BUDEW]: [
    new SpeciesEvolution(
      SpeciesId.ROSELIA,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(70), new DayEvolutionCondition()],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.ROSELIA]: [
    new SpeciesEvolution(SpeciesId.ROSERADE, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.GULPIN]: [new SpeciesEvolution(SpeciesId.SWALOT, 26, null, null)],
  [SpeciesId.CARVANHA]: [new SpeciesEvolution(SpeciesId.SHARPEDO, 30, null, null)],
  [SpeciesId.WAILMER]: [new SpeciesEvolution(SpeciesId.WAILORD, 40, null, null)],
  [SpeciesId.NUMEL]: [new SpeciesEvolution(SpeciesId.CAMERUPT, 33, null, null)],
  [SpeciesId.SPOINK]: [new SpeciesEvolution(SpeciesId.GRUMPIG, 32, null, null)],
  [SpeciesId.TRAPINCH]: [new SpeciesEvolution(SpeciesId.VIBRAVA, 35, null, null)],
  [SpeciesId.VIBRAVA]: [new SpeciesEvolution(SpeciesId.FLYGON, 45, null, null)],
  [SpeciesId.CACNEA]: [new SpeciesEvolution(SpeciesId.CACTURNE, 32, null, null)],
  [SpeciesId.SWABLU]: [new SpeciesEvolution(SpeciesId.ALTARIA, 35, null, null)],
  [SpeciesId.BARBOACH]: [new SpeciesEvolution(SpeciesId.WHISCASH, 30, null, null)],
  [SpeciesId.CORPHISH]: [new SpeciesEvolution(SpeciesId.CRAWDAUNT, 30, null, null)],
  [SpeciesId.BALTOY]: [new SpeciesEvolution(SpeciesId.CLAYDOL, 36, null, null)],
  [SpeciesId.LILEEP]: [new SpeciesEvolution(SpeciesId.CRADILY, 40, null, null)],
  [SpeciesId.ANORITH]: [new SpeciesEvolution(SpeciesId.ARMALDO, 40, null, null)],
  [SpeciesId.FEEBAS]: [
    new SpeciesEvolution(SpeciesId.MILOTIC, 1, EvolutionItem.PRISM_SCALE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.SHUPPET]: [new SpeciesEvolution(SpeciesId.BANETTE, 37, null, null)],
  [SpeciesId.DUSKULL]: [new SpeciesEvolution(SpeciesId.DUSCLOPS, 37, null, null)],
  [SpeciesId.DUSCLOPS]: [
    new SpeciesEvolution(SpeciesId.DUSKNOIR, 1, EvolutionItem.REAPER_CLOTH, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  /** Chingling is from Gen 4 */
  [SpeciesId.CHINGLING]: [
    new SpeciesEvolution(
      SpeciesId.CHIMECHO,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(90), new NightEvolutionCondition()],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  /** Custom: Froslass evolves by level instead of Dawn Stone */
  [SpeciesId.SNORUNT]: [
    new SpeciesEvolution(SpeciesId.GLALIE, 42, null, [new MaleEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.FROSLASS, 42, null, [new FemaleEvolutionCondition()]),
  ],
  [SpeciesId.SPHEAL]: [new SpeciesEvolution(SpeciesId.SEALEO, 32, null, null)],
  [SpeciesId.SEALEO]: [new SpeciesEvolution(SpeciesId.WALREIN, 44, null, null)],
  /** Custom: Clamperl evolves based on gender */
  [SpeciesId.CLAMPERL]: [
    new SpeciesEvolution(
      SpeciesId.HUNTAIL,
      1,
      EvolutionItem.LINKING_CORD /* Deep Sea Tooth */,
      [new MaleEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesEvolution(
      SpeciesId.GOREBYSS,
      1,
      EvolutionItem.LINKING_CORD /* Deep Sea Scale */,
      [new FemaleEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [SpeciesId.BAGON]: [new SpeciesEvolution(SpeciesId.SHELGON, 30, null, null)],
  [SpeciesId.SHELGON]: [new SpeciesEvolution(SpeciesId.SALAMENCE, 50, null, null)],
  [SpeciesId.BELDUM]: [new SpeciesEvolution(SpeciesId.METANG, 20, null, null)],
  [SpeciesId.METANG]: [new SpeciesEvolution(SpeciesId.METAGROSS, 45, null, null)],
};
