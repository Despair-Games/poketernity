import { SpeciesId } from "#enums/species-id";
import {
  DayEvolutionCondition,
  FemaleEvolutionCondition,
  MaleEvolutionCondition,
  MoveKnownEvoCondition,
  NightEvolutionCondition,
  type PokemonEvolutions,
  SpeciesEvolution,
  SpeciesFormEvolution,
  SpeciesFriendshipEvolutionCondition,
  SpeciesOwnedEvoCondition,
} from "#app/data/pokemon-evolutions";
import { EvolutionItem } from "#enums/evolution-item";
import {
  ADVANCED_ITEM_EVO_LEVEL,
  BASCULEGION_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
  HAPPINESS_EVO_LEVEL,
  KINGAMBIT_EVO_LEVEL,
} from "#app/data/pokemon-evolutions/enemy-pokemon-evolution-levels";
import { MoveId } from "#enums/move-id";

export const gen5pokemonFamilyEvolutions: PokemonEvolutions = {
  [SpeciesId.SNIVY]: [new SpeciesEvolution(SpeciesId.SERVINE, 17, null, null)],
  [SpeciesId.SERVINE]: [new SpeciesEvolution(SpeciesId.SERPERIOR, 36, null, null)],
  [SpeciesId.TEPIG]: [new SpeciesEvolution(SpeciesId.PIGNITE, 17, null, null)],
  [SpeciesId.PIGNITE]: [new SpeciesEvolution(SpeciesId.EMBOAR, 36, null, null)],
  [SpeciesId.OSHAWOTT]: [new SpeciesEvolution(SpeciesId.DEWOTT, 17, null, null)],
  [SpeciesId.DEWOTT]: [
    new SpeciesEvolution(SpeciesId.SAMUROTT, 36, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.HISUI_SAMUROTT, 36, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.PATRAT]: [new SpeciesEvolution(SpeciesId.WATCHOG, 20, null, null)],
  [SpeciesId.LILLIPUP]: [new SpeciesEvolution(SpeciesId.HERDIER, 16, null, null)],
  [SpeciesId.HERDIER]: [new SpeciesEvolution(SpeciesId.STOUTLAND, 32, null, null)],
  [SpeciesId.PURRLOIN]: [new SpeciesEvolution(SpeciesId.LIEPARD, 20, null, null)],
  [SpeciesId.PANSAGE]: [
    new SpeciesEvolution(SpeciesId.SIMISAGE, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.PANSEAR]: [
    new SpeciesEvolution(SpeciesId.SIMISEAR, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.PANPOUR]: [
    new SpeciesEvolution(SpeciesId.SIMIPOUR, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.MUNNA]: [
    new SpeciesEvolution(SpeciesId.MUSHARNA, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.PIDOVE]: [new SpeciesEvolution(SpeciesId.TRANQUILL, 21, null, null)],
  [SpeciesId.TRANQUILL]: [new SpeciesEvolution(SpeciesId.UNFEZANT, 32, null, null)],
  [SpeciesId.BLITZLE]: [new SpeciesEvolution(SpeciesId.ZEBSTRIKA, 27, null, null)],
  [SpeciesId.ROGGENROLA]: [new SpeciesEvolution(SpeciesId.BOLDORE, 25, null, null)],
  [SpeciesId.BOLDORE]: [
    new SpeciesEvolution(SpeciesId.GIGALITH, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.WOOBAT]: [
    new SpeciesEvolution(SpeciesId.SWOOBAT, 1, null, [new SpeciesFriendshipEvolutionCondition()], HAPPINESS_EVO_LEVEL),
  ],
  [SpeciesId.DRILBUR]: [new SpeciesEvolution(SpeciesId.EXCADRILL, 31, null, null)],
  [SpeciesId.TIMBURR]: [new SpeciesEvolution(SpeciesId.GURDURR, 25, null, null)],
  [SpeciesId.GURDURR]: [
    new SpeciesEvolution(SpeciesId.CONKELDURR, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.TYMPOLE]: [new SpeciesEvolution(SpeciesId.PALPITOAD, 25, null, null)],
  [SpeciesId.PALPITOAD]: [new SpeciesEvolution(SpeciesId.SEISMITOAD, 36, null, null)],
  [SpeciesId.SEWADDLE]: [new SpeciesEvolution(SpeciesId.SWADLOON, 20, null, null)],
  [SpeciesId.SWADLOON]: [
    new SpeciesEvolution(SpeciesId.LEAVANNY, 1, null, [new SpeciesFriendshipEvolutionCondition()], HAPPINESS_EVO_LEVEL),
  ],
  [SpeciesId.VENIPEDE]: [new SpeciesEvolution(SpeciesId.WHIRLIPEDE, 22, null, null)],
  [SpeciesId.WHIRLIPEDE]: [new SpeciesEvolution(SpeciesId.SCOLIPEDE, 30, null, null)],
  [SpeciesId.COTTONEE]: [
    new SpeciesEvolution(SpeciesId.WHIMSICOTT, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.PETILIL]: [
    new SpeciesEvolution(SpeciesId.HISUI_LILLIGANT, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(SpeciesId.LILLIGANT, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Custom: Requires knowing Wave Crash instead of surviving 294 recoil damage */
  [SpeciesId.BASCULIN]: [
    new SpeciesFormEvolution(
      SpeciesId.BASCULEGION,
      "white-striped",
      "male",
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.WAVE_CRASH), new MaleEvolutionCondition()],
      BASCULEGION_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.BASCULEGION,
      "white-striped",
      "female",
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.WAVE_CRASH), new FemaleEvolutionCondition()],
      BASCULEGION_EVO_LEVEL,
    ),
  ],
  [SpeciesId.SANDILE]: [new SpeciesEvolution(SpeciesId.KROKOROK, 29, null, null)],
  [SpeciesId.KROKOROK]: [new SpeciesEvolution(SpeciesId.KROOKODILE, 40, null, null)],
  [SpeciesId.DARUMAKA]: [new SpeciesEvolution(SpeciesId.DARMANITAN, 35, null, null)],
  [SpeciesId.DWEBBLE]: [new SpeciesEvolution(SpeciesId.CRUSTLE, 34, null, null)],
  [SpeciesId.SCRAGGY]: [new SpeciesEvolution(SpeciesId.SCRAFTY, 39, null, null)],
  [SpeciesId.YAMASK]: [new SpeciesEvolution(SpeciesId.COFAGRIGUS, 34, null, null)],
  [SpeciesId.TIRTOUGA]: [new SpeciesEvolution(SpeciesId.CARRACOSTA, 37, null, null)],
  [SpeciesId.ARCHEN]: [new SpeciesEvolution(SpeciesId.ARCHEOPS, 37, null, null)],
  [SpeciesId.TRUBBISH]: [new SpeciesEvolution(SpeciesId.GARBODOR, 36, null, null)],
  [SpeciesId.ZORUA]: [new SpeciesEvolution(SpeciesId.ZOROARK, 30, null, null)],
  [SpeciesId.MINCCINO]: [
    new SpeciesEvolution(SpeciesId.CINCCINO, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.GOTHITA]: [new SpeciesEvolution(SpeciesId.GOTHORITA, 32, null, null)],
  [SpeciesId.GOTHORITA]: [new SpeciesEvolution(SpeciesId.GOTHITELLE, 41, null, null)],
  [SpeciesId.SOLOSIS]: [new SpeciesEvolution(SpeciesId.DUOSION, 32, null, null)],
  [SpeciesId.DUOSION]: [new SpeciesEvolution(SpeciesId.REUNICLUS, 41, null, null)],
  [SpeciesId.DUCKLETT]: [new SpeciesEvolution(SpeciesId.SWANNA, 35, null, null)],
  [SpeciesId.VANILLITE]: [new SpeciesEvolution(SpeciesId.VANILLISH, 35, null, null)],
  [SpeciesId.VANILLISH]: [new SpeciesEvolution(SpeciesId.VANILLUXE, 47, null, null)],
  [SpeciesId.DEERLING]: [new SpeciesEvolution(SpeciesId.SAWSBUCK, 34, null, null)],
  [SpeciesId.KARRABLAST]: [
    new SpeciesEvolution(
      SpeciesId.ESCAVALIER,
      1,
      EvolutionItem.LINKING_CORD,
      [new SpeciesOwnedEvoCondition(SpeciesId.SHELMET)],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],

  [SpeciesId.FOONGUS]: [new SpeciesEvolution(SpeciesId.AMOONGUSS, 39, null, null)],
  [SpeciesId.FRILLISH]: [new SpeciesEvolution(SpeciesId.JELLICENT, 40, null, null)],
  [SpeciesId.JOLTIK]: [new SpeciesEvolution(SpeciesId.GALVANTULA, 36, null, null)],
  [SpeciesId.FERROSEED]: [new SpeciesEvolution(SpeciesId.FERROTHORN, 40, null, null)],
  [SpeciesId.KLINK]: [new SpeciesEvolution(SpeciesId.KLANG, 38, null, null)],
  [SpeciesId.KLANG]: [new SpeciesEvolution(SpeciesId.KLINKLANG, 49, null, null)],
  [SpeciesId.TYNAMO]: [new SpeciesEvolution(SpeciesId.EELEKTRIK, 39, null, null)],
  [SpeciesId.EELEKTRIK]: [
    new SpeciesEvolution(SpeciesId.EELEKTROSS, 1, EvolutionItem.THUNDER_STONE, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.ELGYEM]: [new SpeciesEvolution(SpeciesId.BEHEEYEM, 42, null, null)],
  [SpeciesId.LITWICK]: [new SpeciesEvolution(SpeciesId.LAMPENT, 41, null, null)],
  [SpeciesId.LAMPENT]: [
    new SpeciesEvolution(SpeciesId.CHANDELURE, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.AXEW]: [new SpeciesEvolution(SpeciesId.FRAXURE, 38, null, null)],
  [SpeciesId.FRAXURE]: [new SpeciesEvolution(SpeciesId.HAXORUS, 48, null, null)],
  [SpeciesId.CUBCHOO]: [new SpeciesEvolution(SpeciesId.BEARTIC, 37, null, null)],
  [SpeciesId.SHELMET]: [
    new SpeciesEvolution(
      SpeciesId.ACCELGOR,
      1,
      EvolutionItem.LINKING_CORD,
      [new SpeciesOwnedEvoCondition(SpeciesId.KARRABLAST)],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [SpeciesId.MIENFOO]: [new SpeciesEvolution(SpeciesId.MIENSHAO, 50, null, null)],
  [SpeciesId.GOLETT]: [new SpeciesEvolution(SpeciesId.GOLURK, 43, null, null)],
  [SpeciesId.PAWNIARD]: [new SpeciesEvolution(SpeciesId.BISHARP, 52, null, null)],
  [SpeciesId.BISHARP]: [
    new SpeciesEvolution(SpeciesId.KINGAMBIT, 1, EvolutionItem.LEADERS_CREST, null, KINGAMBIT_EVO_LEVEL),
  ],
  [SpeciesId.RUFFLET]: [
    new SpeciesEvolution(SpeciesId.BRAVIARY, 54, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.HISUI_BRAVIARY, 54, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.VULLABY]: [new SpeciesEvolution(SpeciesId.MANDIBUZZ, 54, null, null)],
  [SpeciesId.DEINO]: [new SpeciesEvolution(SpeciesId.ZWEILOUS, 50, null, null)],
  [SpeciesId.ZWEILOUS]: [new SpeciesEvolution(SpeciesId.HYDREIGON, 64, null, null)],
  [SpeciesId.LARVESTA]: [new SpeciesEvolution(SpeciesId.VOLCARONA, 59, null, null)],
};
