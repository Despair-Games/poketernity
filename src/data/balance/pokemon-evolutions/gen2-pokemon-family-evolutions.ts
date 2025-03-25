import { EvolutionItem } from "#enums/evolution-item";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import {
  ADVANCED_ITEM_EVO_LEVEL,
  AMBIPOM_EVO_LEVEL,
  BABY_HAPPINESS_EVO_LEVEL,
  DUDUNSPARCE_EVO_LEVEL,
  FARIGARIF_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
  MAMOSWINE_EVO_LEVEL,
  SUDOWOODO_EVO_LEVEL,
  WYRDEER_EVO_LEVEL,
  YANMEGA_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";
import {
  type PokemonEvolutions,
  SpeciesFormEvolution,
  SpeciesEvolution,
  NightEvolutionCondition,
  DayEvolutionCondition,
  MoveKnownEvoCondition,
  SpeciesOwnedEvoCondition,
  RngFormEvoCondition,
  BabySpeciesFriendshipEvolutionCondition,
} from "#app/data/pokemon-evolutions";

export const gen2pokemonFamilyEvolutions: PokemonEvolutions = {
  [SpeciesId.CHIKORITA]: [new SpeciesEvolution(SpeciesId.BAYLEEF, 16, null, null)],
  [SpeciesId.BAYLEEF]: [new SpeciesEvolution(SpeciesId.MEGANIUM, 32, null, null)],
  [SpeciesId.CYNDAQUIL]: [new SpeciesEvolution(SpeciesId.QUILAVA, 14, null, null)],
  [SpeciesId.QUILAVA]: [
    new SpeciesEvolution(SpeciesId.TYPHLOSION, 36, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.HISUI_TYPHLOSION, 36, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.TOTODILE]: [new SpeciesEvolution(SpeciesId.CROCONAW, 18, null, null)],
  [SpeciesId.CROCONAW]: [new SpeciesEvolution(SpeciesId.FERALIGATR, 30, null, null)],
  [SpeciesId.SENTRET]: [new SpeciesEvolution(SpeciesId.FURRET, 15, null, null)],
  [SpeciesId.HOOTHOOT]: [new SpeciesEvolution(SpeciesId.NOCTOWL, 20, null, null)],
  [SpeciesId.LEDYBA]: [new SpeciesEvolution(SpeciesId.LEDIAN, 18, null, null)],
  [SpeciesId.SPINARAK]: [new SpeciesEvolution(SpeciesId.ARIADOS, 22, null, null)],
  [SpeciesId.CHINCHOU]: [new SpeciesEvolution(SpeciesId.LANTURN, 27, null, null)],
  [SpeciesId.TOGEPI]: [
    new SpeciesEvolution(
      SpeciesId.TOGETIC,
      1,
      null,
      [new BabySpeciesFriendshipEvolutionCondition()],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.TOGETIC]: [
    new SpeciesEvolution(SpeciesId.TOGEKISS, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.NATU]: [new SpeciesEvolution(SpeciesId.XATU, 25, null, null)],
  [SpeciesId.MAREEP]: [new SpeciesEvolution(SpeciesId.FLAAFFY, 15, null, null)],
  [SpeciesId.FLAAFFY]: [new SpeciesEvolution(SpeciesId.AMPHAROS, 30, null, null)],
  /** Azurill is from Gen 3 */
  [SpeciesId.AZURILL]: [
    new SpeciesEvolution(
      SpeciesId.MARILL,
      1,
      null,
      [new BabySpeciesFriendshipEvolutionCondition()],
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.MARILL]: [new SpeciesEvolution(SpeciesId.AZUMARILL, 18, null, null)],
  /** Bonsly is from Gen 4 */
  [SpeciesId.BONSLY]: [
    new SpeciesEvolution(SpeciesId.SUDOWOODO, 1, null, [new MoveKnownEvoCondition(MoveId.MIMIC)], SUDOWOODO_EVO_LEVEL),
  ],
  [SpeciesId.HOPPIP]: [new SpeciesEvolution(SpeciesId.SKIPLOOM, 18, null, null)],
  [SpeciesId.SKIPLOOM]: [new SpeciesEvolution(SpeciesId.JUMPLUFF, 27, null, null)],
  [SpeciesId.AIPOM]: [
    new SpeciesEvolution(SpeciesId.AMBIPOM, 1, null, [new MoveKnownEvoCondition(MoveId.DOUBLE_HIT)], AMBIPOM_EVO_LEVEL),
  ],
  [SpeciesId.SUNKERN]: [
    new SpeciesEvolution(SpeciesId.SUNFLORA, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.YANMA]: [
    new SpeciesEvolution(
      SpeciesId.YANMEGA,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.ANCIENT_POWER)],
      YANMEGA_EVO_LEVEL,
    ),
  ],
  [SpeciesId.WOOPER]: [new SpeciesEvolution(SpeciesId.QUAGSIRE, 20, null, null)],
  [SpeciesId.MURKROW]: [
    new SpeciesEvolution(SpeciesId.HONCHKROW, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.MISDREAVUS]: [
    new SpeciesEvolution(SpeciesId.MISMAGIUS, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Wynaut is from Gen 3 */
  [SpeciesId.WYNAUT]: [new SpeciesEvolution(SpeciesId.WOBBUFFET, 15, null, null)],
  [SpeciesId.GIRAFARIG]: [
    new SpeciesEvolution(
      SpeciesId.FARIGIRAF,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.TWIN_BEAM)],
      FARIGARIF_EVO_LEVEL,
    ),
  ],
  [SpeciesId.PINECO]: [new SpeciesEvolution(SpeciesId.FORRETRESS, 31, null, null)],
  [SpeciesId.DUNSPARCE]: [
    new SpeciesFormEvolution(
      SpeciesId.DUDUNSPARCE,
      "",
      "three-segment",
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.HYPER_DRILL), new RngFormEvoCondition()],
      DUDUNSPARCE_EVO_LEVEL,
    ),
    new SpeciesEvolution(
      SpeciesId.DUDUNSPARCE,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.HYPER_DRILL)],
      DUDUNSPARCE_EVO_LEVEL,
    ),
  ],
  [SpeciesId.GLIGAR]: [
    new SpeciesEvolution(
      SpeciesId.GLISCOR,
      1,
      EvolutionItem.RAZOR_FANG,
      [new NightEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [SpeciesId.SNUBBULL]: [new SpeciesEvolution(SpeciesId.GRANBULL, 23, null, null)],
  [SpeciesId.SNEASEL]: [
    new SpeciesEvolution(
      SpeciesId.WEAVILE,
      1,
      EvolutionItem.RAZOR_CLAW,
      [new NightEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [SpeciesId.TEDDIURSA]: [new SpeciesEvolution(SpeciesId.URSARING, 30, null, null)],
  [SpeciesId.URSARING]: [
    new SpeciesEvolution(
      SpeciesId.URSALUNA,
      1,
      EvolutionItem.PEAT_BLOCK,
      [new NightEvolutionCondition()],
      ADVANCED_ITEM_EVO_LEVEL,
    ), // Note: Ursaring does not evolve into Bloodmoon Ursaluna
  ],
  [SpeciesId.SLUGMA]: [new SpeciesEvolution(SpeciesId.MAGCARGO, 38, null, null)],
  [SpeciesId.SWINUB]: [new SpeciesEvolution(SpeciesId.PILOSWINE, 33, null, null)],
  [SpeciesId.PILOSWINE]: [
    new SpeciesEvolution(
      SpeciesId.MAMOSWINE,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.ANCIENT_POWER)],
      MAMOSWINE_EVO_LEVEL,
    ),
  ],
  [SpeciesId.REMORAID]: [new SpeciesEvolution(SpeciesId.OCTILLERY, 25, null, null)],
  /** Mantyke is from Gen 4 */
  [SpeciesId.MANTYKE]: [
    new SpeciesEvolution(SpeciesId.MANTINE, 32, null, [new SpeciesOwnedEvoCondition(SpeciesId.REMORAID)]),
  ],
  [SpeciesId.HOUNDOUR]: [new SpeciesEvolution(SpeciesId.HOUNDOOM, 24, null, null)],
  [SpeciesId.PHANPY]: [new SpeciesEvolution(SpeciesId.DONPHAN, 25, null, null)],
  [SpeciesId.STANTLER]: [
    new SpeciesEvolution(
      SpeciesId.WYRDEER,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.PSYSHIELD_BASH)],
      WYRDEER_EVO_LEVEL,
    ),
  ],
  [SpeciesId.LARVITAR]: [new SpeciesEvolution(SpeciesId.PUPITAR, 30, null, null)],
  [SpeciesId.PUPITAR]: [new SpeciesEvolution(SpeciesId.TYRANITAR, 55, null, null)],
};
