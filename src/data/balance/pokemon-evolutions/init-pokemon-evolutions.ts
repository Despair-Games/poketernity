import { globalScene } from "#app/global-scene";
import { randSeedInt } from "#app/utils";
import { Biome } from "#enums/biome";
import { ElementalType } from "#enums/elemental-type";
import { EvolutionItem } from "#enums/evolution-item";
import { Gender } from "#enums/gender";
import { MoveId } from "#enums/move-id";
import { Nature } from "#enums/nature";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
import { WeatherType } from "#enums/weather-type";
import { gen1pokemonFamilyEvolutions } from "./gen1-pokemon-family-evolutions";
import { GENERIC_ITEM_EVO_LEVEL, HAPPINESS_EVO_LEVEL, KNOW_MOVE_EVO_LEVEL } from "./enemy-pokemon-evolution-levels";
import {
  type PokemonEvolutions,
  SpeciesFormEvolution,
  SpeciesEvolution,
  SpeciesEvolutionCondition,
  SpeciesFriendshipEvolutionCondition,
} from "#app/data/pokemon-evolutions";
import { gen2pokemonFamilyEvolutions } from "#app/data/balance/pokemon-evolutions/gen2-pokemon-family-evolutions";
import { gen3pokemonFamilyEvolutions } from "#app/data/balance/pokemon-evolutions/gen3-pokemon-family-evolutions";
import { gen4pokemonFamilyEvolutions } from "#app/data/balance/pokemon-evolutions/gen4-pokemon-family-evolutions";
import { gen5pokemonFamilyEvolutions } from "#app/data/balance/pokemon-evolutions/gen5-pokemon-family-evolutions";

export const pokemonEvolutions: PokemonEvolutions = {
  ...gen1pokemonFamilyEvolutions,
  ...gen2pokemonFamilyEvolutions,
  ...gen3pokemonFamilyEvolutions,
  ...gen4pokemonFamilyEvolutions,
  ...gen5pokemonFamilyEvolutions,
  [Species.CHESPIN]: [new SpeciesEvolution(Species.QUILLADIN, 16, null, null)],
  [Species.QUILLADIN]: [new SpeciesEvolution(Species.CHESNAUGHT, 36, null, null)],
  [Species.FENNEKIN]: [new SpeciesEvolution(Species.BRAIXEN, 16, null, null)],
  [Species.BRAIXEN]: [new SpeciesEvolution(Species.DELPHOX, 36, null, null)],
  [Species.FROAKIE]: [new SpeciesEvolution(Species.FROGADIER, 16, null, null)],
  [Species.FROGADIER]: [new SpeciesEvolution(Species.GRENINJA, 36, null, null)],
  [Species.BUNNELBY]: [new SpeciesEvolution(Species.DIGGERSBY, 20, null, null)],
  [Species.FLETCHLING]: [new SpeciesEvolution(Species.FLETCHINDER, 17, null, null)],
  [Species.FLETCHINDER]: [new SpeciesEvolution(Species.TALONFLAME, 35, null, null)],
  [Species.SCATTERBUG]: [new SpeciesEvolution(Species.SPEWPA, 9, null, null)],
  [Species.SPEWPA]: [new SpeciesEvolution(Species.VIVILLON, 12, null, null)],
  [Species.LITLEO]: [new SpeciesEvolution(Species.PYROAR, 35, null, null)],
  [Species.FLABEBE]: [new SpeciesEvolution(Species.FLOETTE, 19, null, null)],
  [Species.SKIDDO]: [new SpeciesEvolution(Species.GOGOAT, 32, null, null)],
  [Species.PANCHAM]: [
    new SpeciesEvolution(
      Species.PANGORO,
      32,
      null,
      new SpeciesEvolutionCondition(
        (_p) =>
          !!globalScene.getPlayerParty().find((p) => p.getTypes(false, false, true).indexOf(ElementalType.DARK) > -1),
      ),
    ),
  ],
  [Species.ESPURR]: [
    new SpeciesFormEvolution(
      Species.MEOWSTIC,
      "",
      "female",
      25,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
    ),
    new SpeciesFormEvolution(
      Species.MEOWSTIC,
      "",
      "",
      25,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE),
      ),
    ),
  ],
  [Species.HONEDGE]: [new SpeciesEvolution(Species.DOUBLADE, 35, null, null)],
  [Species.INKAY]: [new SpeciesEvolution(Species.MALAMAR, 30, null, null)],
  [Species.BINACLE]: [new SpeciesEvolution(Species.BARBARACLE, 39, null, null)],
  [Species.SKRELP]: [new SpeciesEvolution(Species.DRAGALGE, 48, null, null)],
  [Species.CLAUNCHER]: [new SpeciesEvolution(Species.CLAWITZER, 37, null, null)],
  [Species.TYRUNT]: [
    new SpeciesEvolution(
      Species.TYRANTRUM,
      39,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.AMAURA]: [
    new SpeciesEvolution(
      Species.AURORUS,
      39,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
  ],
  [Species.GOOMY]: [
    new SpeciesEvolution(
      Species.HISUI_SLIGGOO,
      40,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.SLIGGOO,
      40,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.SLIGGOO]: [
    new SpeciesEvolution(
      Species.GOODRA,
      50,
      null,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.hasWeather([WeatherType.RAIN, WeatherType.FOG, WeatherType.HEAVY_RAIN]),
      ),
    ),
  ],
  [Species.BERGMITE]: [
    new SpeciesEvolution(
      Species.HISUI_AVALUGG,
      37,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.AVALUGG,
      37,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.NOIBAT]: [new SpeciesEvolution(Species.NOIVERN, 48, null, null)],
  [Species.ROWLET]: [new SpeciesEvolution(Species.DARTRIX, 17, null, null)],
  [Species.DARTRIX]: [
    new SpeciesEvolution(
      Species.HISUI_DECIDUEYE,
      36,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.DECIDUEYE,
      34,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.LITTEN]: [new SpeciesEvolution(Species.TORRACAT, 17, null, null)],
  [Species.TORRACAT]: [new SpeciesEvolution(Species.INCINEROAR, 34, null, null)],
  [Species.POPPLIO]: [new SpeciesEvolution(Species.BRIONNE, 17, null, null)],
  [Species.BRIONNE]: [new SpeciesEvolution(Species.PRIMARINA, 34, null, null)],
  [Species.PIKIPEK]: [new SpeciesEvolution(Species.TRUMBEAK, 14, null, null)],
  [Species.TRUMBEAK]: [new SpeciesEvolution(Species.TOUCANNON, 28, null, null)],
  [Species.YUNGOOS]: [
    new SpeciesEvolution(
      Species.GUMSHOOS,
      20,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.GRUBBIN]: [new SpeciesEvolution(Species.CHARJABUG, 20, null, null)],
  [Species.CUTIEFLY]: [new SpeciesEvolution(Species.RIBOMBEE, 25, null, null)],
  [Species.MAREANIE]: [new SpeciesEvolution(Species.TOXAPEX, 38, null, null)],
  [Species.MUDBRAY]: [new SpeciesEvolution(Species.MUDSDALE, 30, null, null)],
  [Species.DEWPIDER]: [new SpeciesEvolution(Species.ARAQUANID, 22, null, null)],
  [Species.FOMANTIS]: [
    new SpeciesEvolution(
      Species.LURANTIS,
      34,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.MORELULL]: [new SpeciesEvolution(Species.SHIINOTIC, 24, null, null)],
  [Species.SALANDIT]: [
    new SpeciesEvolution(
      Species.SALAZZLE,
      33,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
    ),
  ],
  [Species.STUFFUL]: [new SpeciesEvolution(Species.BEWEAR, 27, null, null)],
  [Species.BOUNSWEET]: [new SpeciesEvolution(Species.STEENEE, 18, null, null)],
  [Species.WIMPOD]: [new SpeciesEvolution(Species.GOLISOPOD, 30, null, null)],
  [Species.SANDYGAST]: [new SpeciesEvolution(Species.PALOSSAND, 42, null, null)],
  [Species.JANGMO_O]: [new SpeciesEvolution(Species.HAKAMO_O, 35, null, null)],
  [Species.HAKAMO_O]: [new SpeciesEvolution(Species.KOMMO_O, 45, null, null)],
  [Species.COSMOG]: [new SpeciesEvolution(Species.COSMOEM, 23, null, null)],
  [Species.COSMOEM]: [
    /** TODO: Create a constant for Cosmoem later */
    new SpeciesEvolution(Species.SOLGALEO, 1, EvolutionItem.SUN_FLUTE, null, 53),
    new SpeciesEvolution(Species.LUNALA, 1, EvolutionItem.MOON_FLUTE, null, 53),
  ],
  [Species.MELTAN]: [new SpeciesEvolution(Species.MELMETAL, 48, null, null)],
  [Species.ALOLA_RATTATA]: [
    new SpeciesEvolution(
      Species.ALOLA_RATICATE,
      20,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
  ],
  [Species.ALOLA_DIGLETT]: [new SpeciesEvolution(Species.ALOLA_DUGTRIO, 26, null, null)],
  [Species.ALOLA_GEODUDE]: [new SpeciesEvolution(Species.ALOLA_GRAVELER, 25, null, null)],
  [Species.ALOLA_GRIMER]: [new SpeciesEvolution(Species.ALOLA_MUK, 38, null, null)],
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
  [Species.SILICOBRA]: [new SpeciesEvolution(Species.SANDACONDA, 36, null, null)],
  [Species.ARROKUDA]: [new SpeciesEvolution(Species.BARRASKEWDA, 26, null, null)],
  [Species.TOXEL]: [
    new SpeciesFormEvolution(
      Species.TOXTRICITY,
      "",
      "lowkey",
      30,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          [
            Nature.LONELY,
            Nature.BOLD,
            Nature.RELAXED,
            Nature.TIMID,
            Nature.SERIOUS,
            Nature.MODEST,
            Nature.MILD,
            Nature.QUIET,
            Nature.BASHFUL,
            Nature.CALM,
            Nature.GENTLE,
            Nature.CAREFUL,
          ].indexOf(p.getNature()) > -1,
      ),
    ),
    new SpeciesFormEvolution(Species.TOXTRICITY, "", "amped", 30, null, null),
  ],
  [Species.SIZZLIPEDE]: [new SpeciesEvolution(Species.CENTISKORCH, 28, null, null)],
  [Species.HATENNA]: [new SpeciesEvolution(Species.HATTREM, 32, null, null)],
  [Species.HATTREM]: [new SpeciesEvolution(Species.HATTERENE, 42, null, null)],
  [Species.IMPIDIMP]: [new SpeciesEvolution(Species.MORGREM, 32, null, null)],
  [Species.MORGREM]: [new SpeciesEvolution(Species.GRIMMSNARL, 42, null, null)],
  [Species.CUFANT]: [new SpeciesEvolution(Species.COPPERAJAH, 34, null, null)],
  [Species.DREEPY]: [new SpeciesEvolution(Species.DRAKLOAK, 50, null, null)],
  [Species.DRAKLOAK]: [new SpeciesEvolution(Species.DRAGAPULT, 60, null, null)],
  [Species.GALAR_MEOWTH]: [new SpeciesEvolution(Species.PERRSERKER, 28, null, null)],
  [Species.GALAR_PONYTA]: [new SpeciesEvolution(Species.GALAR_RAPIDASH, 40, null, null)],
  /** Custom level */
  [Species.GALAR_FARFETCHD]: [new SpeciesEvolution(Species.SIRFETCHD, 30, null, null)],
  /** Same levels as Slowbro evolve level */
  [Species.GALAR_SLOWPOKE]: [
    new SpeciesEvolution(Species.GALAR_SLOWBRO, 1, EvolutionItem.GALARICA_CUFF, null, 37),
    new SpeciesEvolution(Species.GALAR_SLOWKING, 1, EvolutionItem.GALARICA_WREATH, null, 37),
  ],
  [Species.GALAR_CORSOLA]: [new SpeciesEvolution(Species.CURSOLA, 38, null, null)],
  [Species.GALAR_ZIGZAGOON]: [new SpeciesEvolution(Species.GALAR_LINOONE, 20, null, null)],
  [Species.GALAR_LINOONE]: [
    new SpeciesEvolution(
      Species.OBSTAGOON,
      35,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
  ],
  /** Custom: Same level as Cofagrigus evolve level */
  [Species.GALAR_YAMASK]: [new SpeciesEvolution(Species.RUNERIGUS, 34, null, null)],
  [Species.HISUI_ZORUA]: [new SpeciesEvolution(Species.HISUI_ZOROARK, 30, null, null)],
  [Species.HISUI_SLIGGOO]: [
    new SpeciesEvolution(
      Species.HISUI_GOODRA,
      50,
      null,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.hasWeather([WeatherType.RAIN, WeatherType.FOG, WeatherType.HEAVY_RAIN]),
      ),
    ),
  ],
  [Species.SPRIGATITO]: [new SpeciesEvolution(Species.FLORAGATO, 16, null, null)],
  [Species.FLORAGATO]: [new SpeciesEvolution(Species.MEOWSCARADA, 36, null, null)],
  [Species.FUECOCO]: [new SpeciesEvolution(Species.CROCALOR, 16, null, null)],
  [Species.CROCALOR]: [new SpeciesEvolution(Species.SKELEDIRGE, 36, null, null)],
  [Species.QUAXLY]: [new SpeciesEvolution(Species.QUAXWELL, 16, null, null)],
  [Species.QUAXWELL]: [new SpeciesEvolution(Species.QUAQUAVAL, 36, null, null)],
  [Species.LECHONK]: [
    new SpeciesFormEvolution(
      Species.OINKOLOGNE,
      "",
      "female",
      18,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.FEMALE,
        (p) => (p.gender = Gender.FEMALE),
      ),
    ),
    new SpeciesFormEvolution(
      Species.OINKOLOGNE,
      "",
      "",
      18,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.gender === Gender.MALE,
        (p) => (p.gender = Gender.MALE),
      ),
    ),
  ],
  [Species.TAROUNTULA]: [new SpeciesEvolution(Species.SPIDOPS, 15, null, null)],
  [Species.NYMBLE]: [new SpeciesEvolution(Species.LOKIX, 24, null, null)],
  [Species.PAWMI]: [new SpeciesEvolution(Species.PAWMO, 18, null, null)],
  [Species.PAWMO]: [new SpeciesEvolution(Species.PAWMOT, 32, null, null)],
  [Species.TANDEMAUS]: [
    new SpeciesFormEvolution(
      Species.MAUSHOLD,
      "",
      "three",
      25,
      null,
      new SpeciesEvolutionCondition((p) => {
        let ret = false;
        globalScene.executeWithSeedOffset(() => (ret = !randSeedInt(4)), p.id);
        return ret;
      }),
    ),
    new SpeciesEvolution(Species.MAUSHOLD, 25, null, null),
  ],
  [Species.FIDOUGH]: [new SpeciesEvolution(Species.DACHSBUN, 26, null, null)],
  [Species.SMOLIV]: [new SpeciesEvolution(Species.DOLLIV, 25, null, null)],
  [Species.DOLLIV]: [new SpeciesEvolution(Species.ARBOLIVA, 35, null, null)],
  [Species.NACLI]: [new SpeciesEvolution(Species.NACLSTACK, 24, null, null)],
  [Species.NACLSTACK]: [new SpeciesEvolution(Species.GARGANACL, 38, null, null)],
  [Species.WATTREL]: [new SpeciesEvolution(Species.KILOWATTREL, 25, null, null)],
  [Species.MASCHIFF]: [new SpeciesEvolution(Species.MABOSSTIFF, 30, null, null)],
  [Species.SHROODLE]: [new SpeciesEvolution(Species.GRAFAIAI, 28, null, null)],
  [Species.BRAMBLIN]: [new SpeciesEvolution(Species.BRAMBLEGHAST, 30, null, null)],
  [Species.TOEDSCOOL]: [new SpeciesEvolution(Species.TOEDSCRUEL, 30, null, null)],
  [Species.RELLOR]: [new SpeciesEvolution(Species.RABSCA, 29, null, null)],
  [Species.FLITTLE]: [new SpeciesEvolution(Species.ESPATHRA, 35, null, null)],
  [Species.TINKATINK]: [new SpeciesEvolution(Species.TINKATUFF, 24, null, null)],
  [Species.TINKATUFF]: [new SpeciesEvolution(Species.TINKATON, 38, null, null)],
  [Species.WIGLETT]: [new SpeciesEvolution(Species.WUGTRIO, 26, null, null)],
  [Species.FINIZEN]: [new SpeciesEvolution(Species.PALAFIN, 38, null, null)],
  [Species.VAROOM]: [new SpeciesEvolution(Species.REVAVROOM, 40, null, null)],
  [Species.GLIMMET]: [new SpeciesEvolution(Species.GLIMMORA, 35, null, null)],
  [Species.GREAVARD]: [
    new SpeciesEvolution(
      Species.HOUNDSTONE,
      30,
      null,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
  ],
  [Species.FRIGIBAX]: [new SpeciesEvolution(Species.ARCTIBAX, 35, null, null)],
  [Species.ARCTIBAX]: [new SpeciesEvolution(Species.BAXCALIBUR, 54, null, null)],
  [Species.PALDEA_WOOPER]: [new SpeciesEvolution(Species.CLODSIRE, 20, null, null)],

  [Species.FLOETTE]: [
    new SpeciesEvolution(Species.FLORGES, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.DOUBLADE]: [
    new SpeciesEvolution(Species.AEGISLASH, 1, EvolutionItem.DUSK_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.HELIOPTILE]: [
    new SpeciesEvolution(Species.HELIOLISK, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CHARJABUG]: [
    new SpeciesEvolution(Species.VIKAVOLT, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CRABRAWLER]: [
    new SpeciesEvolution(Species.CRABOMINABLE, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ROCKRUFF]: [
    new SpeciesFormEvolution(
      Species.LYCANROC,
      "",
      "midday",
      25,
      null,
      new SpeciesEvolutionCondition(
        (p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]) && p.formIndex === 0,
      ),
    ),
    new SpeciesFormEvolution(
      Species.LYCANROC,
      "own-tempo",
      "dusk",
      25,
      null,
      new SpeciesEvolutionCondition((p) => p.formIndex === 1),
    ),
    new SpeciesFormEvolution(
      Species.LYCANROC,
      "",
      "midnight",
      25,
      null,
      new SpeciesEvolutionCondition(
        (p) => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT]) && p.formIndex === 0,
      ),
    ),
  ],
  [Species.STEENEE]: [
    new SpeciesEvolution(
      Species.TSAREENA,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.STOMP).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.POIPOLE]: [
    new SpeciesEvolution(
      Species.NAGANADEL,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.DRAGON_PULSE).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.ALOLA_SANDSHREW]: [
    new SpeciesEvolution(Species.ALOLA_SANDSLASH, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ALOLA_VULPIX]: [
    new SpeciesEvolution(Species.ALOLA_NINETALES, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.APPLIN]: [
    new SpeciesEvolution(Species.DIPPLIN, 1, EvolutionItem.SYRUPY_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.FLAPPLE, 1, EvolutionItem.TART_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.APPLETUN, 1, EvolutionItem.SWEET_APPLE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CLOBBOPUS]: [
    new SpeciesEvolution(
      Species.GRAPPLOCT,
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) => p.moveset.filter((m) => m.moveId === MoveId.TAUNT).length > 0,
      ) /*Once Taunt is implemented, change evo level to 1 and delay to LONG*/,
      KNOW_MOVE_EVO_LEVEL,
    ),
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
  [Species.MILCERY]: [
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "vanilla-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.TOWN, Biome.PLAINS, Biome.GRASS, Biome.TALL_GRASS, Biome.METROPOLIS]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "ruby-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.BADLANDS, Biome.VOLCANO, Biome.GRAVEYARD, Biome.FACTORY, Biome.SLUM]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "matcha-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.FOREST, Biome.SWAMP, Biome.MEADOW, Biome.JUNGLE]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "mint-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.SEA, Biome.BEACH, Biome.LAKE, Biome.SEABED]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "lemon-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([
          Biome.DESERT,
          Biome.POWER_PLANT,
          Biome.DOJO,
          Biome.RUINS,
          Biome.CONSTRUCTION_SITE,
        ]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "salted-cream",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) =>
        globalScene.arena.isInBiome([Biome.MOUNTAIN, Biome.CAVE, Biome.ICE_CAVE, Biome.FAIRY_CAVE, Biome.SNOWY_FOREST]),
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "ruby-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isInBiome([Biome.WASTELAND, Biome.LABORATORY])),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "caramel-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isInBiome([Biome.TEMPLE, Biome.ISLAND])),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.ALCREMIE,
      "",
      "rainbow-swirl",
      1,
      EvolutionItem.STRAWBERRY_SWEET,
      new SpeciesEvolutionCondition((_p) => globalScene.arena.isInBiome([Biome.SPACE, Biome.ABYSS, Biome.END])),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.DURALUDON]: [
    new SpeciesFormEvolution(Species.ARCHALUDON, "", "", 1, EvolutionItem.METAL_ALLOY, null, GENERIC_ITEM_EVO_LEVEL),
  ],
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
  [Species.GALAR_DARUMAKA]: [
    new SpeciesEvolution(Species.GALAR_DARMANITAN, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
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
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.BARB_BARRAGE).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],
  [Species.HISUI_SNEASEL]: [
    new SpeciesEvolution(
      Species.SNEASLER,
      1,
      EvolutionItem.RAZOR_CLAW,
      new SpeciesEvolutionCondition(
        (_p) => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]) /* Razor claw at day */,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.CHARCADET]: [
    new SpeciesEvolution(Species.ARMAROUGE, 1, EvolutionItem.AUSPICIOUS_ARMOR, null, GENERIC_ITEM_EVO_LEVEL),
    new SpeciesEvolution(Species.CERULEDGE, 1, EvolutionItem.MALICIOUS_ARMOR, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.TADBULB]: [
    new SpeciesEvolution(Species.BELLIBOLT, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CAPSAKID]: [
    new SpeciesEvolution(Species.SCOVILLAIN, 1, EvolutionItem.FIRE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CETODDLE]: [new SpeciesEvolution(Species.CETITAN, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.POLTCHAGEIST]: [
    new SpeciesFormEvolution(
      Species.SINISTCHA,
      "counterfeit",
      "unremarkable",
      1,
      EvolutionItem.UNREMARKABLE_TEACUP,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.SINISTCHA,
      "artisan",
      "masterpiece",
      1,
      EvolutionItem.MASTERPIECE_TEACUP,
      null,
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
  [Species.DIPPLIN]: [
    new SpeciesEvolution(
      Species.HYDRAPPLE,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.DRAGON_CHEER).length > 0),
      KNOW_MOVE_EVO_LEVEL,
    ),
  ],

  [Species.SPRITZEE]: [new SpeciesEvolution(Species.AROMATISSE, 1, EvolutionItem.SACHET, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.SWIRLIX]: [
    new SpeciesEvolution(Species.SLURPUFF, 1, EvolutionItem.WHIPPED_DREAM, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PHANTUMP]: [
    new SpeciesEvolution(Species.TREVENANT, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PUMPKABOO]: [
    new SpeciesEvolution(Species.GOURGEIST, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ALOLA_GRAVELER]: [
    new SpeciesEvolution(Species.ALOLA_GOLEM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],

  [Species.SWADLOON]: [
    new SpeciesEvolution(Species.LEAVANNY, 1, null, new SpeciesFriendshipEvolutionCondition(120), HAPPINESS_EVO_LEVEL),
  ],
  [Species.TYPE_NULL]: [
    new SpeciesEvolution(Species.SILVALLY, 1, null, new SpeciesFriendshipEvolutionCondition(100), HAPPINESS_EVO_LEVEL),
  ],
  [Species.ALOLA_MEOWTH]: [
    new SpeciesEvolution(
      Species.ALOLA_PERSIAN,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(120),
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.SNOM]: [
    new SpeciesEvolution(
      Species.FROSMOTH,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(90, (_p) =>
        globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT]),
      ),
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.GIMMIGHOUL]: [
    new SpeciesFormEvolution(
      Species.GHOLDENGO,
      "chest",
      "",
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p.evoCounter
            + p.getHeldItems().filter((m) => m.isDamageMoneyRewardModifier()).length
            + globalScene.findModifiers(
              (m) => m.isMoneyMultiplierModifier() || m.isExtraModifierModifier() || m.isTempExtraModifierModifier(),
            ).length
          > 9,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
    new SpeciesFormEvolution(
      Species.GHOLDENGO,
      "roaming",
      "",
      1,
      null,
      new SpeciesEvolutionCondition(
        (p) =>
          p.evoCounter
            + p.getHeldItems().filter((m) => m.isDamageMoneyRewardModifier()).length
            + globalScene.findModifiers(
              (m) => m.isMoneyMultiplierModifier() || m.isExtraModifierModifier() || m.isTempExtraModifierModifier(),
            ).length
          > 9,
      ),
      GENERIC_ITEM_EVO_LEVEL,
    ),
  ],
};
