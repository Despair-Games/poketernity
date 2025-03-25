import { SpeciesId } from "#enums/species-id";
import {
  DayEvolutionCondition,
  FemaleEvolutionCondition,
  MoveKnownEvoCondition,
  NightEvolutionCondition,
  type PokemonEvolutions,
  SpeciesEvolution,
  SpeciesFormEvolution,
  SpeciesFriendshipEvolutionCondition,
} from "#app/data/pokemon-evolutions";
import { EvolutionItem } from "#enums/evolution-item";
import {
  GENERIC_ITEM_EVO_LEVEL,
  HAPPINESS_EVO_LEVEL,
  NAGANADEL_EVO_LEVEL,
  TSAREENA_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";
import { MoveId } from "#enums/move-id";

export const gen7pokemonFamilyEvolutions: PokemonEvolutions = {
  [SpeciesId.ROWLET]: [new SpeciesEvolution(SpeciesId.DARTRIX, 17, null, null)],
  [SpeciesId.DARTRIX]: [
    new SpeciesEvolution(SpeciesId.DECIDUEYE, 34, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.HISUI_DECIDUEYE, 36, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.LITTEN]: [new SpeciesEvolution(SpeciesId.TORRACAT, 17, null, null)],
  [SpeciesId.TORRACAT]: [new SpeciesEvolution(SpeciesId.INCINEROAR, 34, null, null)],
  [SpeciesId.POPPLIO]: [new SpeciesEvolution(SpeciesId.BRIONNE, 17, null, null)],
  [SpeciesId.BRIONNE]: [new SpeciesEvolution(SpeciesId.PRIMARINA, 34, null, null)],
  [SpeciesId.PIKIPEK]: [new SpeciesEvolution(SpeciesId.TRUMBEAK, 14, null, null)],
  [SpeciesId.TRUMBEAK]: [new SpeciesEvolution(SpeciesId.TOUCANNON, 28, null, null)],
  [SpeciesId.YUNGOOS]: [new SpeciesEvolution(SpeciesId.GUMSHOOS, 20, null, [new DayEvolutionCondition()])],
  [SpeciesId.GRUBBIN]: [new SpeciesEvolution(SpeciesId.CHARJABUG, 20, null, null)],
  [SpeciesId.CHARJABUG]: [
    new SpeciesEvolution(SpeciesId.VIKAVOLT, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.CRABRAWLER]: [
    new SpeciesEvolution(SpeciesId.CRABOMINABLE, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.CUTIEFLY]: [new SpeciesEvolution(SpeciesId.RIBOMBEE, 25, null, null)],
  [SpeciesId.ROCKRUFF]: [
    new SpeciesFormEvolution(SpeciesId.LYCANROC, "", "midday", 25, null, [new DayEvolutionCondition()]),
    new SpeciesFormEvolution(SpeciesId.LYCANROC, "", "midnight", 25, null, [new NightEvolutionCondition()]),
    // Custom: Own Tempo Rockruff evolves into Dusk Lycanroc regardless of time
    new SpeciesFormEvolution(SpeciesId.LYCANROC, "own-tempo", "dusk", 25, null, null),
  ],
  [SpeciesId.MAREANIE]: [new SpeciesEvolution(SpeciesId.TOXAPEX, 38, null, null)],
  [SpeciesId.MUDBRAY]: [new SpeciesEvolution(SpeciesId.MUDSDALE, 30, null, null)],
  [SpeciesId.DEWPIDER]: [new SpeciesEvolution(SpeciesId.ARAQUANID, 22, null, null)],
  [SpeciesId.FOMANTIS]: [new SpeciesEvolution(SpeciesId.LURANTIS, 34, null, [new DayEvolutionCondition()])],
  [SpeciesId.MORELULL]: [new SpeciesEvolution(SpeciesId.SHIINOTIC, 24, null, null)],
  [SpeciesId.SALANDIT]: [new SpeciesEvolution(SpeciesId.SALAZZLE, 33, null, [new FemaleEvolutionCondition()])],
  [SpeciesId.STUFFUL]: [new SpeciesEvolution(SpeciesId.BEWEAR, 27, null, null)],
  [SpeciesId.BOUNSWEET]: [new SpeciesEvolution(SpeciesId.STEENEE, 18, null, null)],
  [SpeciesId.STEENEE]: [
    new SpeciesEvolution(SpeciesId.TSAREENA, 1, null, [new MoveKnownEvoCondition(MoveId.STOMP)], TSAREENA_EVO_LEVEL),
  ],
  [SpeciesId.WIMPOD]: [new SpeciesEvolution(SpeciesId.GOLISOPOD, 30, null, null)],
  [SpeciesId.SANDYGAST]: [new SpeciesEvolution(SpeciesId.PALOSSAND, 42, null, null)],
  [SpeciesId.TYPE_NULL]: [
    new SpeciesEvolution(SpeciesId.SILVALLY, 1, null, [new SpeciesFriendshipEvolutionCondition()], HAPPINESS_EVO_LEVEL),
  ],
  [SpeciesId.JANGMO_O]: [new SpeciesEvolution(SpeciesId.HAKAMO_O, 35, null, null)],
  [SpeciesId.HAKAMO_O]: [new SpeciesEvolution(SpeciesId.KOMMO_O, 45, null, null)],
  [SpeciesId.COSMOG]: [new SpeciesEvolution(SpeciesId.COSMOEM, 43, null, null)],
  [SpeciesId.COSMOEM]: [
    new SpeciesEvolution(SpeciesId.SOLGALEO, 53, null, [new DayEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.LUNALA, 53, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.MELTAN]: [new SpeciesEvolution(SpeciesId.MELMETAL, 48, null, null)],
  /** Poipole learns dragon pulse at level 1 so enemy evolve level here is changed */
  [SpeciesId.POIPOLE]: [
    new SpeciesEvolution(
      SpeciesId.NAGANADEL,
      1,
      null,
      [new MoveKnownEvoCondition(MoveId.DRAGON_PULSE)],
      NAGANADEL_EVO_LEVEL,
    ),
  ],

  /** Alola Pokemon also go in this file */

  [SpeciesId.ALOLA_RATTATA]: [
    new SpeciesEvolution(SpeciesId.ALOLA_RATICATE, 20, null, [new NightEvolutionCondition()]),
  ],
  [SpeciesId.ALOLA_SANDSHREW]: [
    new SpeciesEvolution(SpeciesId.ALOLA_SANDSLASH, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.ALOLA_VULPIX]: [
    new SpeciesEvolution(SpeciesId.ALOLA_NINETALES, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.ALOLA_DIGLETT]: [new SpeciesEvolution(SpeciesId.ALOLA_DUGTRIO, 26, null, null)],
  [SpeciesId.ALOLA_MEOWTH]: [
    new SpeciesEvolution(
      SpeciesId.ALOLA_PERSIAN,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition()],
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.ALOLA_GEODUDE]: [new SpeciesEvolution(SpeciesId.ALOLA_GRAVELER, 25, null, null)],
  [SpeciesId.ALOLA_GRAVELER]: [
    new SpeciesEvolution(SpeciesId.ALOLA_GOLEM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [SpeciesId.ALOLA_GRIMER]: [new SpeciesEvolution(SpeciesId.ALOLA_MUK, 38, null, null)],
};
