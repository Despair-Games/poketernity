import { globalScene } from "#app/global-scene";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
import {
  type PokemonEvolutions,
  SpeciesEvolution,
  SpeciesEvolutionCondition,
  SpeciesFormEvolution,
} from "#app/data/pokemon-evolutions";
import { Gender } from "#enums/gender";
import { EvolutionItem } from "#enums/evolution-item";
import {
  ADVANCED_ITEM_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";
import { ElementalType } from "#enums/elemental-type";
import { WeatherType } from "#enums/weather-type";

export const gen6pokemonFamilyEvolutions: PokemonEvolutions = {
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
  [Species.FLOETTE]: [
    new SpeciesEvolution(Species.FLORGES, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.SKIDDO]: [new SpeciesEvolution(Species.GOGOAT, 32, null, null)],
  [Species.PANCHAM]: [
    new SpeciesEvolution(
      Species.PANGORO,
      32,
      null,
      new SpeciesEvolutionCondition(
        () =>
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
  [Species.DOUBLADE]: [
    new SpeciesEvolution(Species.AEGISLASH, 1, EvolutionItem.DUSK_STONE, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [Species.SPRITZEE]: [new SpeciesEvolution(Species.AROMATISSE, 1, EvolutionItem.SACHET, null, GENERIC_ITEM_EVO_LEVEL)],
  [Species.SWIRLIX]: [
    new SpeciesEvolution(Species.SLURPUFF, 1, EvolutionItem.WHIPPED_DREAM, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Does not need to be upside down */
  [Species.INKAY]: [new SpeciesEvolution(Species.MALAMAR, 30, null, null)],
  [Species.BINACLE]: [new SpeciesEvolution(Species.BARBARACLE, 39, null, null)],
  [Species.SKRELP]: [new SpeciesEvolution(Species.DRAGALGE, 48, null, null)],
  [Species.CLAUNCHER]: [new SpeciesEvolution(Species.CLAWITZER, 37, null, null)],
  [Species.HELIOPTILE]: [
    new SpeciesEvolution(Species.HELIOLISK, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.TYRUNT]: [
    new SpeciesEvolution(
      Species.TYRANTRUM,
      39,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.AMAURA]: [
    new SpeciesEvolution(
      Species.AURORUS,
      39,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
  ],
  [Species.GOOMY]: [
    new SpeciesEvolution(
      Species.HISUI_SLIGGOO,
      40,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.SLIGGOO,
      40,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  /** Hisui Sliggoo is from Gen 8 */
  [Species.HISUI_SLIGGOO]: [
    new SpeciesEvolution(
      Species.HISUI_GOODRA,
      50,
      null,
      new SpeciesEvolutionCondition(() =>
        globalScene.arena.hasWeather([WeatherType.RAIN, WeatherType.FOG, WeatherType.HEAVY_RAIN]),
      ),
    ),
  ],
  [Species.SLIGGOO]: [
    new SpeciesEvolution(
      Species.GOODRA,
      50,
      null,
      new SpeciesEvolutionCondition(() =>
        globalScene.arena.hasWeather([WeatherType.RAIN, WeatherType.FOG, WeatherType.HEAVY_RAIN]),
      ),
    ),
  ],
  [Species.PHANTUMP]: [
    new SpeciesEvolution(Species.TREVENANT, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.PUMPKABOO]: [
    new SpeciesEvolution(Species.GOURGEIST, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.BERGMITE]: [
    new SpeciesEvolution(
      Species.HISUI_AVALUGG,
      37,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.AVALUGG,
      37,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.NOIBAT]: [new SpeciesEvolution(Species.NOIVERN, 48, null, null)],
};
