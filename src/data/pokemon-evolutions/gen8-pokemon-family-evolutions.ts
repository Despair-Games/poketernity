import { SpeciesId } from "#enums/species-id";
import {
  BiomeEvoCondition,
  DayEvolutionCondition,
  MoveKnownEvoCondition,
  LowKeyToxtricityEvoCondition,
  NightEvolutionCondition,
  type PokemonEvolutions,
  SpeciesEvolution,
  SpeciesFormEvolution,
  SpeciesFriendshipEvolutionCondition,
  AmpedToxtricityEvoCondition,
} from "#app/data/pokemon-evolutions";
import { EvolutionItem } from "#enums/evolution-item";
import {
  ADVANCED_ITEM_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
  GRAPPLOCT_EVO_LEVEL,
  HAPPINESS_EVO_LEVEL,
  OVERQWIL_EVO_LEVEL,
  SIRFETCHD_EVO_LEVEL,
  SLOWPOKE_FAMILY_EVO_LEVEL,
} from "#app/data/pokemon-evolutions/enemy-pokemon-evolution-levels";
import { MoveId } from "#enums/move-id";
import { BiomeId } from "#enums/biome-id";

export const gen8pokemonFamilyEvolutions: PokemonEvolutions = {
  [SpeciesId.GROOKEY]: [new SpeciesEvolution(SpeciesId.THWACKEY, 16, null, null)],
  [SpeciesId.THWACKEY]: [new SpeciesEvolution(SpeciesId.RILLABOOM, 35, null, null)],
  [SpeciesId.SCORBUNNY]: [new SpeciesEvolution(SpeciesId.RABOOT, 16, null, null)],
  [SpeciesId.RABOOT]: [new SpeciesEvolution(SpeciesId.CINDERACE, 35, null, null)],
  [SpeciesId.SOBBLE]: [new SpeciesEvolution(SpeciesId.DRIZZILE, 16, null, null)],
  [SpeciesId.DRIZZILE]: [new SpeciesEvolution(SpeciesId.INTELEON, 35, null, null)],
  [SpeciesId.SKWOVET]: [new SpeciesEvolution(SpeciesId.GREEDENT, 24, null, null)],
  [SpeciesId.ROOKIDEE]: [new SpeciesEvolution(SpeciesId.CORVISQUIRE, 18, null, null)],
  [SpeciesId.CORVISQUIRE]: [new SpeciesEvolution(SpeciesId.CORVIKNIGHT, 38, null, null)],
  [SpeciesId.BLIPBUG]: [new SpeciesEvolution(SpeciesId.DOTTLER, 10, null, null)],
  [SpeciesId.DOTTLER]: [new SpeciesEvolution(SpeciesId.ORBEETLE, 30, null, null)],
  [SpeciesId.NICKIT]: [new SpeciesEvolution(SpeciesId.THIEVUL, 18, null, null)],
  [SpeciesId.GOSSIFLEUR]: [new SpeciesEvolution(SpeciesId.ELDEGOSS, 20, null, null)],
  [SpeciesId.WOOLOO]: [new SpeciesEvolution(SpeciesId.DUBWOOL, 24, null, null)],
  [SpeciesId.CHEWTLE]: [new SpeciesEvolution(SpeciesId.DREDNAW, 22, null, null)],
  [SpeciesId.YAMPER]: [new SpeciesEvolution(SpeciesId.BOLTUND, 25, null, null)],
  [SpeciesId.ROLYCOLY]: [new SpeciesEvolution(SpeciesId.CARKOL, 18, null, null)],
  [SpeciesId.CARKOL]: [new SpeciesEvolution(SpeciesId.COALOSSAL, 34, null, null)],
  [SpeciesId.APPLIN]: [
    new SpeciesEvolution(SpeciesId.DIPPLIN, 1, EvolutionItem.SYRUPY_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(SpeciesId.FLAPPLE, 1, EvolutionItem.TART_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(SpeciesId.APPLETUN, 1, EvolutionItem.SWEET_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Dipplin is from Gen 9 */
  [SpeciesId.DIPPLIN]: [
    new SpeciesEvolution(
      SpeciesId.HYDRAPPLE,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.DRAGON_CHEER)],
      ADVANCED_ITEM_EVO_LEVEL,
    ),
  ],
  [SpeciesId.SILICOBRA]: [new SpeciesEvolution(SpeciesId.SANDACONDA, 36, null, null)],
  [SpeciesId.ARROKUDA]: [new SpeciesEvolution(SpeciesId.BARRASKEWDA, 26, null, null)],
  [SpeciesId.TOXEL]: [
    new SpeciesFormEvolution(SpeciesId.TOXTRICITY, "", "amped", 30, null, [new AmpedToxtricityEvoCondition()]),
    new SpeciesFormEvolution(SpeciesId.TOXTRICITY, "", "lowkey", 30, null, [new LowKeyToxtricityEvoCondition()]),
  ],
  [SpeciesId.SIZZLIPEDE]: [new SpeciesEvolution(SpeciesId.CENTISKORCH, 28, null, null)],
  [SpeciesId.CLOBBOPUS]: [
    new SpeciesEvolution(SpeciesId.GRAPPLOCT, 1, null, [new MoveKnownEvoCondition(MoveId.TAUNT)], GRAPPLOCT_EVO_LEVEL),
  ],
  [SpeciesId.SINISTEA]: [
    new SpeciesFormEvolution(
      SpeciesId.POLTEAGEIST,
      "phony",
      "phony",
      1,
      EvolutionItem.CRACKED_POT,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.POLTEAGEIST,
      "antique",
      "antique",
      1,
      EvolutionItem.CHIPPED_POT,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [SpeciesId.HATENNA]: [new SpeciesEvolution(SpeciesId.HATTREM, 32, null, null)],
  [SpeciesId.HATTREM]: [new SpeciesEvolution(SpeciesId.HATTERENE, 42, null, null)],
  [SpeciesId.IMPIDIMP]: [new SpeciesEvolution(SpeciesId.MORGREM, 32, null, null)],
  [SpeciesId.MORGREM]: [new SpeciesEvolution(SpeciesId.GRIMMSNARL, 42, null, null)],
  /** TODO: Will need to change these when biomes are changed */
  // Custom: None of these require time of day
  [SpeciesId.MILCERY]: [
    new SpeciesFormEvolution(
      SpeciesId.ALCREMIE,
      "",
      "vanilla-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([BiomeId.TOWN, BiomeId.PLAINS, BiomeId.GRASS, BiomeId.TALL_GRASS, BiomeId.METROPOLIS])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALCREMIE,
      "",
      "ruby-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([BiomeId.BADLANDS, BiomeId.VOLCANO, BiomeId.GRAVEYARD, BiomeId.FACTORY, BiomeId.SLUM])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALCREMIE,
      "",
      "matcha-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([BiomeId.FOREST, BiomeId.SWAMP, BiomeId.MEADOW, BiomeId.JUNGLE])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALCREMIE,
      "",
      "mint-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([BiomeId.SEA, BiomeId.BEACH, BiomeId.LAKE, BiomeId.SEABED])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALCREMIE,
      "",
      "lemon-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [
        new BiomeEvoCondition([
          BiomeId.DESERT,
          BiomeId.POWER_PLANT,
          BiomeId.DOJO,
          BiomeId.RUINS,
          BiomeId.CONSTRUCTION_SITE,
        ]),
      ],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALCREMIE,
      "",
      "salted-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [
        new BiomeEvoCondition([
          BiomeId.MOUNTAIN,
          BiomeId.CAVE,
          BiomeId.ICE_CAVE,
          BiomeId.FAIRY_CAVE,
          BiomeId.SNOWY_FOREST,
        ]),
      ],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALCREMIE,
      "",
      "ruby-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([BiomeId.WASTELAND, BiomeId.LABORATORY])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALCREMIE,
      "",
      "caramel-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([BiomeId.TEMPLE, BiomeId.ISLAND])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.ALCREMIE,
      "",
      "rainbow-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([BiomeId.SPACE, BiomeId.ABYSS, BiomeId.END])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [SpeciesId.SNOM]: [
    new SpeciesEvolution(
      SpeciesId.FROSMOTH,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(), new NightEvolutionCondition()],
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.CUFANT]: [new SpeciesEvolution(SpeciesId.COPPERAJAH, 34, null, null)],
  [SpeciesId.DURALUDON]: [
    new SpeciesFormEvolution(SpeciesId.ARCHALUDON, "", "", 1, EvolutionItem.METAL_ALLOY, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.DREEPY]: [new SpeciesEvolution(SpeciesId.DRAKLOAK, 50, null, null)],
  [SpeciesId.DRAKLOAK]: [new SpeciesEvolution(SpeciesId.DRAGAPULT, 60, null, null)],
  [SpeciesId.KUBFU]: [
    new SpeciesFormEvolution(
      SpeciesId.URSHIFU,
      "",
      "single-strike",
      1,
      EvolutionItem.SCROLL_OF_DARKNESS,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      SpeciesId.URSHIFU,
      "",
      "rapid-strike",
      1,
      EvolutionItem.SCROLL_OF_WATERS,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],

  /** Galar Pokemon also go in this file */

  [SpeciesId.GALAR_MEOWTH]: [new SpeciesEvolution(SpeciesId.PERRSERKER, 28, null, null)],
  [SpeciesId.GALAR_PONYTA]: [new SpeciesEvolution(SpeciesId.GALAR_RAPIDASH, 40, null, null)],
  /** Same enemy evolve levels as Slowbro evolve level */
  [SpeciesId.GALAR_SLOWPOKE]: [
    new SpeciesEvolution(SpeciesId.GALAR_SLOWBRO, 1, EvolutionItem.GALARICA_CUFF, null, SLOWPOKE_FAMILY_EVO_LEVEL),
    new SpeciesEvolution(SpeciesId.GALAR_SLOWKING, 1, EvolutionItem.GALARICA_WREATH, null, SLOWPOKE_FAMILY_EVO_LEVEL),
  ],
  /** Custom: level for evolving */
  [SpeciesId.GALAR_FARFETCHD]: [new SpeciesEvolution(SpeciesId.SIRFETCHD, SIRFETCHD_EVO_LEVEL, null, null)],
  [SpeciesId.GALAR_CORSOLA]: [new SpeciesEvolution(SpeciesId.CURSOLA, 38, null, null)],
  [SpeciesId.GALAR_ZIGZAGOON]: [new SpeciesEvolution(SpeciesId.GALAR_LINOONE, 20, null, null)],
  [SpeciesId.GALAR_LINOONE]: [new SpeciesEvolution(SpeciesId.OBSTAGOON, 35, null, [new NightEvolutionCondition()])],
  [SpeciesId.GALAR_DARUMAKA]: [
    new SpeciesEvolution(SpeciesId.GALAR_DARMANITAN, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Custom: Same level as Cofagrigus evolve level */
  [SpeciesId.GALAR_YAMASK]: [new SpeciesEvolution(SpeciesId.RUNERIGUS, 34, null, null)],

  /** Hisui Pokemon also go in this file */

  [SpeciesId.HISUI_GROWLITHE]: [
    new SpeciesEvolution(SpeciesId.HISUI_ARCANINE, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.HISUI_VOLTORB]: [
    new SpeciesEvolution(SpeciesId.HISUI_ELECTRODE, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.HISUI_QWILFISH]: [
    new SpeciesEvolution(
      SpeciesId.OVERQWIL,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.BARB_BARRAGE)],
      OVERQWIL_EVO_LEVEL,
    ),
  ],
  [SpeciesId.HISUI_SNEASEL]: [
    new SpeciesEvolution(
      SpeciesId.SNEASLER,
      1,
      EvolutionItem.RAZOR_CLAW,
      [new DayEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [SpeciesId.HISUI_ZORUA]: [new SpeciesEvolution(SpeciesId.HISUI_ZOROARK, 30, null, null)],
};
