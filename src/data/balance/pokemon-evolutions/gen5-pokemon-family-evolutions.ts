import { globalScene } from "#app/global-scene";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
import {
  type PokemonEvolutions,
  SpeciesEvolution,
  SpeciesEvolutionCondition,
  SpeciesFormEvolution,
  SpeciesFriendshipEvolutionCondition,
} from "#app/data/pokemon-evolutions";
import { Gender } from "#enums/gender";
import { EvolutionItem } from "#enums/evolution-item";
import {
  ADVANCED_ITEM_EVO_LEVEL,
  BASCULEGION_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
  HAPPINESS_EVO_LEVEL,
  KINGAMBIT_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";
import { MoveId } from "#enums/move-id";

export const gen5pokemonFamilyEvolutions: PokemonEvolutions = {
  [Species.SNIVY]: [new SpeciesEvolution(Species.SERVINE, 17, null, null)],
  [Species.SERVINE]: [new SpeciesEvolution(Species.SERPERIOR, 36, null, null)],
  [Species.TEPIG]: [new SpeciesEvolution(Species.PIGNITE, 17, null, null)],
  [Species.PIGNITE]: [new SpeciesEvolution(Species.EMBOAR, 36, null, null)],
  [Species.OSHAWOTT]: [new SpeciesEvolution(Species.DEWOTT, 17, null, null)],
  [Species.DEWOTT]: [
    new SpeciesEvolution(
      Species.HISUI_SAMUROTT,
      36,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.SAMUROTT,
      36,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.PATRAT]: [new SpeciesEvolution(Species.WATCHOG, 20, null, null)],
  [Species.LILLIPUP]: [new SpeciesEvolution(Species.HERDIER, 16, null, null)],
  [Species.HERDIER]: [new SpeciesEvolution(Species.STOUTLAND, 32, null, null)],
  [Species.PURRLOIN]: [new SpeciesEvolution(Species.LIEPARD, 20, null, null)],
  [Species.PANSAGE]: [
    new SpeciesEvolution(Species.SIMISAGE, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PANSEAR]: [
    new SpeciesEvolution(Species.SIMISEAR, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PANPOUR]: [
    new SpeciesEvolution(Species.SIMIPOUR, 1, EvolutionItem.WATER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.MUNNA]: [new SpeciesEvolution(Species.MUSHARNA, 1, EvolutionItem.MOON_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.PIDOVE]: [new SpeciesEvolution(Species.TRANQUILL, 21, null, null)],
  [Species.TRANQUILL]: [new SpeciesEvolution(Species.UNFEZANT, 32, null, null)],
  [Species.BLITZLE]: [new SpeciesEvolution(Species.ZEBSTRIKA, 27, null, null)],
  [Species.ROGGENROLA]: [new SpeciesEvolution(Species.BOLDORE, 25, null, null)],
  [Species.BOLDORE]: [
    new SpeciesEvolution(Species.GIGALITH, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.WOOBAT]: [
    new SpeciesEvolution(Species.SWOOBAT, 1, null, new SpeciesFriendshipEvolutionCondition(90), HAPPINESS_EVO_LEVEL),
  ],
  [Species.DRILBUR]: [new SpeciesEvolution(Species.EXCADRILL, 31, null, null)],
  [Species.TIMBURR]: [new SpeciesEvolution(Species.GURDURR, 25, null, null)],
  [Species.GURDURR]: [
    new SpeciesEvolution(Species.CONKELDURR, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.TYMPOLE]: [new SpeciesEvolution(Species.PALPITOAD, 25, null, null)],
  [Species.PALPITOAD]: [new SpeciesEvolution(Species.SEISMITOAD, 36, null, null)],
  [Species.SEWADDLE]: [new SpeciesEvolution(Species.SWADLOON, 20, null, null)],
  [Species.SWADLOON]: [
    new SpeciesEvolution(Species.LEAVANNY, 1, null, new SpeciesFriendshipEvolutionCondition(120), HAPPINESS_EVO_LEVEL),
  ],
  [Species.VENIPEDE]: [new SpeciesEvolution(Species.WHIRLIPEDE, 22, null, null)],
  [Species.WHIRLIPEDE]: [new SpeciesEvolution(Species.SCOLIPEDE, 30, null, null)],
  [Species.COTTONEE]: [
    new SpeciesEvolution(Species.WHIMSICOTT, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PETILIL]: [
    new SpeciesEvolution(Species.HISUI_LILLIGANT, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.LILLIGANT, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Custom: Requires knowing Wave Crash instead of surviving 294 recoil damage */
  [Species.BASCULIN]: [
    new SpeciesFormEvolution(
      Species.BASCULEGION,
      "white-striped",
      "female",
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.moveset.filter((m) => m.moveId === MoveId.WAVE_CRASH).length > 0 && p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
      BASCULEGION_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.BASCULEGION,
      "white-striped",
      "male",
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.moveset.filter((m) => m.moveId === MoveId.WAVE_CRASH).length > 0 && p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE),
      ),
      BASCULEGION_EVO_LEVEL,
    ),
  ],
  [Species.SANDILE]: [new SpeciesEvolution(Species.KROKOROK, 29, null, null)],
  [Species.KROKOROK]: [new SpeciesEvolution(Species.KROOKODILE, 40, null, null)],
  [Species.DARUMAKA]: [new SpeciesEvolution(Species.DARMANITAN, 35, null, null)],
  [Species.DWEBBLE]: [new SpeciesEvolution(Species.CRUSTLE, 34, null, null)],
  [Species.SCRAGGY]: [new SpeciesEvolution(Species.SCRAFTY, 39, null, null)],
  [Species.YAMASK]: [new SpeciesEvolution(Species.COFAGRIGUS, 34, null, null)],
  [Species.TIRTOUGA]: [new SpeciesEvolution(Species.CARRACOSTA, 37, null, null)],
  [Species.ARCHEN]: [new SpeciesEvolution(Species.ARCHEOPS, 37, null, null)],
  [Species.TRUBBISH]: [new SpeciesEvolution(Species.GARBODOR, 36, null, null)],
  [Species.ZORUA]: [new SpeciesEvolution(Species.ZOROARK, 30, null, null)],
  [Species.MINCCINO]: [
    new SpeciesEvolution(Species.CINCCINO, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.GOTHITA]: [new SpeciesEvolution(Species.GOTHORITA, 32, null, null)],
  [Species.GOTHORITA]: [new SpeciesEvolution(Species.GOTHITELLE, 41, null, null)],
  [Species.SOLOSIS]: [new SpeciesEvolution(Species.DUOSION, 32, null, null)],
  [Species.DUOSION]: [new SpeciesEvolution(Species.REUNICLUS, 41, null, null)],
  [Species.DUCKLETT]: [new SpeciesEvolution(Species.SWANNA, 35, null, null)],
  [Species.VANILLITE]: [new SpeciesEvolution(Species.VANILLISH, 35, null, null)],
  [Species.VANILLISH]: [new SpeciesEvolution(Species.VANILLUXE, 47, null, null)],
  [Species.DEERLING]: [new SpeciesEvolution(Species.SAWSBUCK, 34, null, null)],
  /** Karrablast requires the player to have owned Shelmet */
  [Species.KARRABLAST]: [
    new SpeciesEvolution(
      Species.ESCAVALIER,
      1,
      EvolutionItem.LINKING_CORD,
      new SpeciesEvolutionCondition(() => !!globalScene.gameData.dexData[Species.SHELMET].caughtAttr),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],

  [Species.FOONGUS]: [new SpeciesEvolution(Species.AMOONGUSS, 39, null, null)],
  [Species.FRILLISH]: [new SpeciesEvolution(Species.JELLICENT, 40, null, null)],
  [Species.JOLTIK]: [new SpeciesEvolution(Species.GALVANTULA, 36, null, null)],
  [Species.FERROSEED]: [new SpeciesEvolution(Species.FERROTHORN, 40, null, null)],
  [Species.KLINK]: [new SpeciesEvolution(Species.KLANG, 38, null, null)],
  [Species.KLANG]: [new SpeciesEvolution(Species.KLINKLANG, 49, null, null)],
  [Species.TYNAMO]: [new SpeciesEvolution(Species.EELEKTRIK, 39, null, null)],
  [Species.EELEKTRIK]: [
    new SpeciesEvolution(Species.EELEKTROSS, 1, EvolutionItem.THUNDER_STONE, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [Species.ELGYEM]: [new SpeciesEvolution(Species.BEHEEYEM, 42, null, null)],
  [Species.LITWICK]: [new SpeciesEvolution(Species.LAMPENT, 41, null, null)],
  [Species.LAMPENT]: [
    new SpeciesEvolution(Species.CHANDELURE, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.AXEW]: [new SpeciesEvolution(Species.FRAXURE, 38, null, null)],
  [Species.FRAXURE]: [new SpeciesEvolution(Species.HAXORUS, 48, null, null)],
  [Species.CUBCHOO]: [new SpeciesEvolution(Species.BEARTIC, 37, null, null)],
  /** Shelmet requires the player to have owned Karrablast */
  [Species.SHELMET]: [
    new SpeciesEvolution(
      Species.ACCELGOR,
      1,
      EvolutionItem.LINKING_CORD,
      new SpeciesEvolutionCondition(() => !!globalScene.gameData.dexData[Species.KARRABLAST].caughtAttr),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.MIENFOO]: [new SpeciesEvolution(Species.MIENSHAO, 50, null, null)],
  [Species.GOLETT]: [new SpeciesEvolution(Species.GOLURK, 43, null, null)],
  [Species.PAWNIARD]: [new SpeciesEvolution(Species.BISHARP, 52, null, null)],
  [Species.BISHARP]: [
    new SpeciesEvolution(Species.KINGAMBIT, 1, EvolutionItem.LEADERS_CREST, null, KINGAMBIT_EVO_LEVEL),
  ],
  [Species.RUFFLET]: [
    new SpeciesEvolution(
      Species.HISUI_BRAVIARY,
      54,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.BRAVIARY,
      54,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.VULLABY]: [new SpeciesEvolution(Species.MANDIBUZZ, 54, null, null)],
  [Species.DEINO]: [new SpeciesEvolution(Species.ZWEILOUS, 50, null, null)],
  [Species.ZWEILOUS]: [new SpeciesEvolution(Species.HYDREIGON, 64, null, null)],
  [Species.LARVESTA]: [new SpeciesEvolution(Species.VOLCARONA, 59, null, null)],
};
