import { Species } from "#enums/species";
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
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";
import { MoveId } from "#enums/move-id";
import { Biome } from "#enums/biome";

export const gen8pokemonFamilyEvolutions: PokemonEvolutions = {
  [Species.GROOKEY]: [new SpeciesEvolution(Species.THWACKEY, 16, null, null)],
  [Species.THWACKEY]: [new SpeciesEvolution(Species.RILLABOOM, 35, null, null)],
  [Species.SCORBUNNY]: [new SpeciesEvolution(Species.RABOOT, 16, null, null)],
  [Species.RABOOT]: [new SpeciesEvolution(Species.CINDERACE, 35, null, null)],
  [Species.SOBBLE]: [new SpeciesEvolution(Species.DRIZZILE, 16, null, null)],
  [Species.DRIZZILE]: [new SpeciesEvolution(Species.INTELEON, 35, null, null)],
  [Species.SKWOVET]: [new SpeciesEvolution(Species.GREEDENT, 24, null, null)],
  [Species.ROOKIDEE]: [new SpeciesEvolution(Species.CORVISQUIRE, 18, null, null)],
  [Species.CORVISQUIRE]: [new SpeciesEvolution(Species.CORVIKNIGHT, 38, null, null)],
  [Species.BLIPBUG]: [new SpeciesEvolution(Species.DOTTLER, 10, null, null)],
  [Species.DOTTLER]: [new SpeciesEvolution(Species.ORBEETLE, 30, null, null)],
  [Species.NICKIT]: [new SpeciesEvolution(Species.THIEVUL, 18, null, null)],
  [Species.GOSSIFLEUR]: [new SpeciesEvolution(Species.ELDEGOSS, 20, null, null)],
  [Species.WOOLOO]: [new SpeciesEvolution(Species.DUBWOOL, 24, null, null)],
  [Species.CHEWTLE]: [new SpeciesEvolution(Species.DREDNAW, 22, null, null)],
  [Species.YAMPER]: [new SpeciesEvolution(Species.BOLTUND, 25, null, null)],
  [Species.ROLYCOLY]: [new SpeciesEvolution(Species.CARKOL, 18, null, null)],
  [Species.CARKOL]: [new SpeciesEvolution(Species.COALOSSAL, 34, null, null)],
  [Species.APPLIN]: [
    new SpeciesEvolution(Species.DIPPLIN, 1, EvolutionItem.SYRUPY_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.FLAPPLE, 1, EvolutionItem.TART_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.APPLETUN, 1, EvolutionItem.SWEET_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Dipplin is from Gen 9 */
  [Species.DIPPLIN]: [
    new SpeciesEvolution(
      Species.HYDRAPPLE,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.DRAGON_CHEER)],
      ADVANCED_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.SILICOBRA]: [new SpeciesEvolution(Species.SANDACONDA, 36, null, null)],
  [Species.ARROKUDA]: [new SpeciesEvolution(Species.BARRASKEWDA, 26, null, null)],
  [Species.TOXEL]: [
    new SpeciesFormEvolution(Species.TOXTRICITY, "", "lowkey", 30, null, [new LowKeyToxtricityEvoCondition()]),
    new SpeciesFormEvolution(Species.TOXTRICITY, "", "amped", 30, null, null),
  ],
  [Species.SIZZLIPEDE]: [new SpeciesEvolution(Species.CENTISKORCH, 28, null, null)],
  [Species.CLOBBOPUS]: [
    new SpeciesEvolution(Species.GRAPPLOCT, 1, null, [new MoveKnownEvoCondition(MoveId.TAUNT)], GRAPPLOCT_EVO_LEVEL),
  ],
  [Species.SINISTEA]: [
    new SpeciesFormEvolution(
      Species.POLTEAGEIST,
      "phony",
      "phony",
      1,
      EvolutionItem.CRACKED_POT,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.POLTEAGEIST,
      "antique",
      "antique",
      1,
      EvolutionItem.CHIPPED_POT,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.HATENNA]: [new SpeciesEvolution(Species.HATTREM, 32, null, null)],
  [Species.HATTREM]: [new SpeciesEvolution(Species.HATTERENE, 42, null, null)],
  [Species.IMPIDIMP]: [new SpeciesEvolution(Species.MORGREM, 32, null, null)],
  [Species.MORGREM]: [new SpeciesEvolution(Species.GRIMMSNARL, 42, null, null)],
  /** TODO: Will need to change these when biomes are changed */
  [Species.MILCERY]: [
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "vanilla-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([Biome.TOWN, Biome.PLAINS, Biome.GRASS, Biome.TALL_GRASS, Biome.METROPOLIS])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "ruby-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([Biome.BADLANDS, Biome.VOLCANO, Biome.GRAVEYARD, Biome.FACTORY, Biome.SLUM])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "matcha-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([Biome.FOREST, Biome.SWAMP, Biome.MEADOW, Biome.JUNGLE])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "mint-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([Biome.SEA, Biome.BEACH, Biome.LAKE, Biome.SEABED])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "lemon-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([Biome.DESERT, Biome.POWER_PLANT, Biome.DOJO, Biome.RUINS, Biome.CONSTRUCTION_SITE])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "salted-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([Biome.MOUNTAIN, Biome.CAVE, Biome.ICE_CAVE, Biome.FAIRY_CAVE, Biome.SNOWY_FOREST])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "ruby-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([Biome.WASTELAND, Biome.LABORATORY])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "caramel-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([Biome.TEMPLE, Biome.ISLAND])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "rainbow-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      [new BiomeEvoCondition([Biome.SPACE, Biome.ABYSS, Biome.END])],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.SNOM]: [
    new SpeciesEvolution(
      Species.FROSMOTH,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(90), new NightEvolutionCondition()],
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.CUFANT]: [new SpeciesEvolution(Species.COPPERAJAH, 34, null, null)],
  [Species.DURALUDON]: [
    new SpeciesFormEvolution(Species.ARCHALUDON, "", "", 1, EvolutionItem.METAL_ALLOY, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [Species.DREEPY]: [new SpeciesEvolution(Species.DRAKLOAK, 50, null, null)],
  [Species.DRAKLOAK]: [new SpeciesEvolution(Species.DRAGAPULT, 60, null, null)],
  [Species.KUBFU]: [
    new SpeciesFormEvolution(
      Species.URSHIFU,
      "",
      "single-strike",
      1,
      EvolutionItem.SCROLL_OF_DARKNESS,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.URSHIFU,
      "",
      "rapid-strike",
      1,
      EvolutionItem.SCROLL_OF_WATERS,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],

  /** Galar Pokemon also go in this file */

  [Species.GALAR_MEOWTH]: [new SpeciesEvolution(Species.PERRSERKER, 28, null, null)],
  [Species.GALAR_PONYTA]: [new SpeciesEvolution(Species.GALAR_RAPIDASH, 40, null, null)],
  /** Same enemy evolve levels as Slowbro evolve level */
  [Species.GALAR_SLOWPOKE]: [
    new SpeciesEvolution(Species.GALAR_SLOWBRO, 1, EvolutionItem.GALARICA_CUFF, null, SLOWPOKE_FAMILY_EVO_LEVEL),
    new SpeciesEvolution(Species.GALAR_SLOWKING, 1, EvolutionItem.GALARICA_WREATH, null, SLOWPOKE_FAMILY_EVO_LEVEL),
  ],
  /** Custom: level for evolving */
  [Species.GALAR_FARFETCHD]: [new SpeciesEvolution(Species.SIRFETCHD, SIRFETCHD_EVO_LEVEL, null, null)],
  [Species.GALAR_CORSOLA]: [new SpeciesEvolution(Species.CURSOLA, 38, null, null)],
  [Species.GALAR_ZIGZAGOON]: [new SpeciesEvolution(Species.GALAR_LINOONE, 20, null, null)],
  [Species.GALAR_LINOONE]: [new SpeciesEvolution(Species.OBSTAGOON, 35, null, [new NightEvolutionCondition()])],
  [Species.GALAR_DARUMAKA]: [
    new SpeciesEvolution(Species.GALAR_DARMANITAN, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Custom: Same level as Cofagrigus evolve level */
  [Species.GALAR_YAMASK]: [new SpeciesEvolution(Species.RUNERIGUS, 34, null, null)],

  /** Hisui Pokemon also go in this file */

  [Species.HISUI_GROWLITHE]: [
    new SpeciesEvolution(Species.HISUI_ARCANINE, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.HISUI_VOLTORB]: [
    new SpeciesEvolution(Species.HISUI_ELECTRODE, 1, EvolutionItem.LEAF_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.HISUI_QWILFISH]: [
    new SpeciesEvolution(
      Species.OVERQWIL,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.BARB_BARRAGE)],
      OVERQWIL_EVO_LEVEL,
    ),
  ],
  [Species.HISUI_SNEASEL]: [
    new SpeciesEvolution(
      Species.SNEASLER,
      1,
      EvolutionItem.RAZOR_CLAW,
      [new DayEvolutionCondition()],
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.HISUI_ZORUA]: [new SpeciesEvolution(Species.HISUI_ZOROARK, 30, null, null)],
};
