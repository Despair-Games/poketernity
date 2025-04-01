import { SpeciesId } from "#enums/species-id";
import {
  DayEvolutionCondition,
  FemaleEvolutionCondition,
  GoodraEvoCondition,
  MaleEvolutionCondition,
  NightEvolutionCondition,
  PangoroEvoCondition,
  type PokemonEvolutions,
  SpeciesEvolution,
  SpeciesFormEvolution,
} from "#app/data/pokemon-evolutions";
import { EvolutionItem } from "#enums/evolution-item";
import {
  ADVANCED_ITEM_EVO_LEVEL,
  GENERIC_ITEM_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";

export const gen6pokemonFamilyEvolutions: PokemonEvolutions = {
  [SpeciesId.CHESPIN]: [new SpeciesEvolution(SpeciesId.QUILLADIN, 16, null, null)],
  [SpeciesId.QUILLADIN]: [new SpeciesEvolution(SpeciesId.CHESNAUGHT, 36, null, null)],
  [SpeciesId.FENNEKIN]: [new SpeciesEvolution(SpeciesId.BRAIXEN, 16, null, null)],
  [SpeciesId.BRAIXEN]: [new SpeciesEvolution(SpeciesId.DELPHOX, 36, null, null)],
  [SpeciesId.FROAKIE]: [new SpeciesEvolution(SpeciesId.FROGADIER, 16, null, null)],
  [SpeciesId.FROGADIER]: [new SpeciesEvolution(SpeciesId.GRENINJA, 36, null, null)],
  [SpeciesId.BUNNELBY]: [new SpeciesEvolution(SpeciesId.DIGGERSBY, 20, null, null)],
  [SpeciesId.FLETCHLING]: [new SpeciesEvolution(SpeciesId.FLETCHINDER, 17, null, null)],
  [SpeciesId.FLETCHINDER]: [new SpeciesEvolution(SpeciesId.TALONFLAME, 35, null, null)],
  [SpeciesId.SCATTERBUG]: [new SpeciesEvolution(SpeciesId.SPEWPA, 9, null, null)],
  [SpeciesId.SPEWPA]: [new SpeciesEvolution(SpeciesId.VIVILLON, 12, null, null)],
  [SpeciesId.LITLEO]: [new SpeciesEvolution(SpeciesId.PYROAR, 35, null, null)],
  [SpeciesId.FLABEBE]: [new SpeciesEvolution(SpeciesId.FLOETTE, 19, null, null)],
  [SpeciesId.FLOETTE]: [
    new SpeciesEvolution(SpeciesId.FLORGES, 1, EvolutionItem.SHINY_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.SKIDDO]: [new SpeciesEvolution(SpeciesId.GOGOAT, 32, null, null)],
  [SpeciesId.PANCHAM]: [new SpeciesEvolution(SpeciesId.PANGORO, 32, null, [new PangoroEvoCondition()])],
  [SpeciesId.ESPURR]: [
    new SpeciesFormEvolution(SpeciesId.MEOWSTIC, "", "", 25, null, [new MaleEvolutionCondition()]),
    new SpeciesFormEvolution(SpeciesId.MEOWSTIC, "", "female", 25, null, [new FemaleEvolutionCondition()]),
  ],
  [SpeciesId.HONEDGE]: [new SpeciesEvolution(SpeciesId.DOUBLADE, 35, null, null)],
  [SpeciesId.DOUBLADE]: [
    new SpeciesEvolution(SpeciesId.AEGISLASH, 1, EvolutionItem.DUSK_STONE, null, ADVANCED_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.SPRITZEE]: [
    new SpeciesEvolution(SpeciesId.AROMATISSE, 1, EvolutionItem.SACHET, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.SWIRLIX]: [
    new SpeciesEvolution(SpeciesId.SLURPUFF, 1, EvolutionItem.WHIPPED_DREAM, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  /** Does not need to be upside down */
  [SpeciesId.INKAY]: [new SpeciesEvolution(SpeciesId.MALAMAR, 30, null, null)],
  [SpeciesId.BINACLE]: [new SpeciesEvolution(SpeciesId.BARBARACLE, 39, null, null)],
  [SpeciesId.SKRELP]: [new SpeciesEvolution(SpeciesId.DRAGALGE, 48, null, null)],
  [SpeciesId.CLAUNCHER]: [new SpeciesEvolution(SpeciesId.CLAWITZER, 37, null, null)],
  [SpeciesId.HELIOPTILE]: [
    new SpeciesEvolution(SpeciesId.HELIOLISK, 1, EvolutionItem.SUN_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.TYRUNT]: [new SpeciesEvolution(SpeciesId.TYRANTRUM, 39, null, [new DayEvolutionCondition()])],
  [SpeciesId.AMAURA]: [new SpeciesEvolution(SpeciesId.AURORUS, 39, null, [new NightEvolutionCondition()])],
  [SpeciesId.GOOMY]: [
    new SpeciesEvolution(SpeciesId.SLIGGOO, 40, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.HISUI_SLIGGOO, 40, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.SLIGGOO]: [new SpeciesEvolution(SpeciesId.GOODRA, 50, null, [new GoodraEvoCondition()])],
  /** Hisui Sliggoo is from Gen 8 */
  [SpeciesId.HISUI_SLIGGOO]: [new SpeciesEvolution(SpeciesId.HISUI_GOODRA, 50, null, [new GoodraEvoCondition()])],
  [SpeciesId.PHANTUMP]: [
    new SpeciesEvolution(SpeciesId.TREVENANT, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.PUMPKABOO]: [
    new SpeciesEvolution(SpeciesId.GOURGEIST, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.BERGMITE]: [
    new SpeciesEvolution(SpeciesId.AVALUGG, 37, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.HISUI_AVALUGG, 37, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.NOIBAT]: [new SpeciesEvolution(SpeciesId.NOIVERN, 48, null, null)],
};
