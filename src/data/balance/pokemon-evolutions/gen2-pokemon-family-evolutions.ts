import { globalScene } from "#app/global-scene";
import { EvolutionItem } from "#enums/evolution-item";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
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
  SpeciesEvolutionCondition,
  SpeciesFriendshipEvolutionCondition,
} from "#app/data/pokemon-evolutions";
import { randSeedInt } from "#app/utils";

export const gen2pokemonFamilyEvolutions: PokemonEvolutions = {
  [Species.CHIKORITA]: [new SpeciesEvolution(Species.BAYLEEF, 16, null, null)],
  [Species.BAYLEEF]: [new SpeciesEvolution(Species.MEGANIUM, 32, null, null)],
  [Species.CYNDAQUIL]: [new SpeciesEvolution(Species.QUILAVA, 14, null, null)],
  [Species.QUILAVA]: [
    new SpeciesEvolution(
      Species.HISUI_TYPHLOSION,
      36,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.TYPHLOSION,
      36,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.TOTODILE]: [new SpeciesEvolution(Species.CROCONAW, 18, null, null)],
  [Species.CROCONAW]: [new SpeciesEvolution(Species.FERALIGATR, 30, null, null)],
  [Species.SENTRET]: [new SpeciesEvolution(Species.FURRET, 15, null, null)],
  [Species.HOOTHOOT]: [new SpeciesEvolution(Species.NOCTOWL, 20, null, null)],
  [Species.LEDYBA]: [new SpeciesEvolution(Species.LEDIAN, 18, null, null)],
  [Species.SPINARAK]: [new SpeciesEvolution(Species.ARIADOS, 22, null, null)],
  [Species.CHINCHOU]: [new SpeciesEvolution(Species.LANTURN, 27, null, null)],
  [Species.TOGEPI]: [
    new SpeciesEvolution(
      Species.TOGETIC,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(70),
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.TOGETIC]: [
    new SpeciesEvolution(Species.TOGEKISS, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.NATU]: [new SpeciesEvolution(Species.XATU, 25, null, null)],
  [Species.MAREEP]: [new SpeciesEvolution(Species.FLAAFFY, 15, null, null)],
  [Species.FLAAFFY]: [new SpeciesEvolution(Species.AMPHAROS, 30, null, null)],
  /** Azurill is from Gen 3 */
  [Species.AZURILL]: [
    new SpeciesEvolution(
      Species.MARILL,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(70),
      BABY_HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.MARILL]: [new SpeciesEvolution(Species.AZUMARILL, 18, null, null)],
  /** Bonsly is from Gen 4 */
  [Species.BONSLY]: [
    new SpeciesEvolution(
      Species.SUDOWOODO,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.MIMIC).length > 0),
      SUDOWOODO_EVO_LEVEL,
    ),
  ],
  [Species.HOPPIP]: [new SpeciesEvolution(Species.SKIPLOOM, 18, null, null)],
  [Species.SKIPLOOM]: [new SpeciesEvolution(Species.JUMPLUFF, 27, null, null)],
  [Species.AIPOM]: [
    new SpeciesEvolution(
      Species.AMBIPOM,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.DOUBLE_HIT).length > 0),
      AMBIPOM_EVO_LEVEL,
    ),
  ],
  [Species.SUNKERN]: [new SpeciesEvolution(Species.SUNFLORA, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.YANMA]: [
    new SpeciesEvolution(
      Species.YANMEGA,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.ANCIENT_POWER).length > 0),
      YANMEGA_EVO_LEVEL,
    ),
  ],
  [Species.WOOPER]: [new SpeciesEvolution(Species.QUAGSIRE, 20, null, null)],
  [Species.MURKROW]: [
    new SpeciesEvolution(Species.HONCHKROW, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.MISDREAVUS]: [
    new SpeciesEvolution(Species.MISMAGIUS, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Wynaut is from Gen 3 */
  [Species.WYNAUT]: [new SpeciesEvolution(Species.WOBBUFFET, 15, null, null)],
  [Species.GIRAFARIG]: [
    new SpeciesEvolution(
      Species.FARIGIRAF,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.TWIN_BEAM).length > 0),
      FARIGARIF_EVO_LEVEL,
    ),
  ],
  [Species.PINECO]: [new SpeciesEvolution(Species.FORRETRESS, 31, null, null)],
  [Species.DUNSPARCE]: [
    new SpeciesFormEvolution(
      Species.DUDUNSPARCE,
      "",
      "three-segment",
      1,
      null,
      new SpeciesEvolutionCondition((p) => {
        let ret = false;
        if (p.moveset.filter((m) => m.moveId === MoveId.HYPER_DRILL).length > 0) {
          globalScene.executeWithSeedOffset(() => (ret = !randSeedInt(4)), p.id);
        }
        return ret;
      }),
      DUDUNSPARCE_EVO_LEVEL,
    ),
    new SpeciesEvolution(
      Species.DUDUNSPARCE,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.HYPER_DRILL).length > 0),
      DUDUNSPARCE_EVO_LEVEL,
    ),
  ],
  [Species.GLIGAR]: [
    new SpeciesEvolution(
      Species.GLISCOR,
      1,
      EvolutionItem.RAZOR_FANG,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.NIGHT, TimeOfDay.DUSK])),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.SNUBBULL]: [new SpeciesEvolution(Species.GRANBULL, 23, null, null)],
  [Species.SNEASEL]: [
    new SpeciesEvolution(
      Species.WEAVILE,
      1,
      EvolutionItem.RAZOR_CLAW,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.NIGHT, TimeOfDay.DUSK])),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.TEDDIURSA]: [new SpeciesEvolution(Species.URSARING, 30, null, null)],
  [Species.URSARING]: [
    new SpeciesEvolution(
      Species.URSALUNA,
      1,
      EvolutionItem.PEAT_BLOCK,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.NIGHT, TimeOfDay.DUSK])),
      ADVANCED_ITEM_EVO_LEVEL,
    ), // Note: Ursaring does not evolve into Bloodmoon Ursaluna
  ],
  [Species.SLUGMA]: [new SpeciesEvolution(Species.MAGCARGO, 38, null, null)],
  [Species.SWINUB]: [new SpeciesEvolution(Species.PILOSWINE, 33, null, null)],
  [Species.PILOSWINE]: [
    new SpeciesEvolution(
      Species.MAMOSWINE,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.ANCIENT_POWER).length > 0),
      MAMOSWINE_EVO_LEVEL,
    ),
  ],
  [Species.REMORAID]: [new SpeciesEvolution(Species.OCTILLERY, 25, null, null)],
  /** Mantyke is from Gen 4 */
  [Species.MANTYKE]: [
    new SpeciesEvolution(
      Species.MANTINE,
      32,
      null,
      /** Requires the player to have caught a Remoraid before */
      new SpeciesEvolutionCondition(() => !!globalScene.gameData.dexData[Species.REMORAID].caughtAttr),
    ),
  ],
  [Species.HOUNDOUR]: [new SpeciesEvolution(Species.HOUNDOOM, 24, null, null)],
  [Species.PHANPY]: [new SpeciesEvolution(Species.DONPHAN, 25, null, null)],
  [Species.STANTLER]: [
    new SpeciesEvolution(
      Species.WYRDEER,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.PSYSHIELD_BASH).length > 0),
      WYRDEER_EVO_LEVEL,
    ),
  ],
  [Species.LARVITAR]: [new SpeciesEvolution(Species.PUPITAR, 30, null, null)],
  [Species.PUPITAR]: [new SpeciesEvolution(Species.TYRANITAR, 55, null, null)],
};
