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
  GENERIC_ITEM_EVO_LEVEL,
  HAPPINESS_EVO_LEVEL,
  NAGANADEL_EVO_LEVEL,
  TSAREENA_EVO_LEVEL,
} from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";
import { MoveId } from "#enums/move-id";

export const gen7pokemonFamilyEvolutions: PokemonEvolutions = {
  [Species.ROWLET]: [new SpeciesEvolution(Species.DARTRIX, 17, null, null)],
  [Species.DARTRIX]: [
    new SpeciesEvolution(
      Species.HISUI_DECIDUEYE,
      36,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.DECIDUEYE,
      34,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
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
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.GRUBBIN]: [new SpeciesEvolution(Species.CHARJABUG, 20, null, null)],
  [Species.CHARJABUG]: [
    new SpeciesEvolution(Species.VIKAVOLT, 1, EvolutionItem.THUNDER_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CRABRAWLER]: [
    new SpeciesEvolution(Species.CRABOMINABLE, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.CUTIEFLY]: [new SpeciesEvolution(Species.RIBOMBEE, 25, null, null)],
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
  [Species.MAREANIE]: [new SpeciesEvolution(Species.TOXAPEX, 38, null, null)],
  [Species.MUDBRAY]: [new SpeciesEvolution(Species.MUDSDALE, 30, null, null)],
  [Species.DEWPIDER]: [new SpeciesEvolution(Species.ARAQUANID, 22, null, null)],
  [Species.FOMANTIS]: [
    new SpeciesEvolution(
      Species.LURANTIS,
      34,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.MORELULL]: [new SpeciesEvolution(Species.SHIINOTIC, 24, null, null)],
  [Species.SALANDIT]: [
    new SpeciesEvolution(Species.SALAZZLE, 33, null, new SpeciesEvolutionCondition((p) => p.gender === Gender.FEMALE)),
  ],
  [Species.STUFFUL]: [new SpeciesEvolution(Species.BEWEAR, 27, null, null)],
  [Species.BOUNSWEET]: [new SpeciesEvolution(Species.STEENEE, 18, null, null)],
  [Species.STEENEE]: [
    new SpeciesEvolution(
      Species.TSAREENA,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.STOMP).length > 0),
      TSAREENA_EVO_LEVEL,
    ),
  ],
  [Species.WIMPOD]: [new SpeciesEvolution(Species.GOLISOPOD, 30, null, null)],
  [Species.SANDYGAST]: [new SpeciesEvolution(Species.PALOSSAND, 42, null, null)],
  [Species.TYPE_NULL]: [
    new SpeciesEvolution(Species.SILVALLY, 1, null, new SpeciesFriendshipEvolutionCondition(100), HAPPINESS_EVO_LEVEL),
  ],
  [Species.JANGMO_O]: [new SpeciesEvolution(Species.HAKAMO_O, 35, null, null)],
  [Species.HAKAMO_O]: [new SpeciesEvolution(Species.KOMMO_O, 45, null, null)],
  [Species.COSMOG]: [new SpeciesEvolution(Species.COSMOEM, 23, null, null)],
  [Species.COSMOEM]: [
    new SpeciesEvolution(
      Species.LUNALA,
      53,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
    new SpeciesEvolution(
      Species.SOLGALEO,
      53,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY])),
    ),
  ],
  [Species.MELTAN]: [new SpeciesEvolution(Species.MELMETAL, 48, null, null)],
  /** Poipole learns dragon pulse at level 1 so enemy evolve level here is changed */
  [Species.POIPOLE]: [
    new SpeciesEvolution(
      Species.NAGANADEL,
      1,
      null,
      new SpeciesEvolutionCondition((p) => p.moveset.filter((m) => m.moveId === MoveId.DRAGON_PULSE).length > 0),
      NAGANADEL_EVO_LEVEL,
    ),
  ],

  /** Alola Pokemon also go in this file */

  [Species.ALOLA_RATTATA]: [
    new SpeciesEvolution(
      Species.ALOLA_RATICATE,
      20,
      null,
      new SpeciesEvolutionCondition(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT])),
    ),
  ],
  [Species.ALOLA_SANDSHREW]: [
    new SpeciesEvolution(Species.ALOLA_SANDSLASH, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ALOLA_VULPIX]: [
    new SpeciesEvolution(Species.ALOLA_NINETALES, 1, EvolutionItem.ICE_STONE, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ALOLA_DIGLETT]: [new SpeciesEvolution(Species.ALOLA_DUGTRIO, 26, null, null)],
  [Species.ALOLA_MEOWTH]: [
    new SpeciesEvolution(
      Species.ALOLA_PERSIAN,
      1,
      null,
      new SpeciesFriendshipEvolutionCondition(120),
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.ALOLA_GEODUDE]: [new SpeciesEvolution(Species.ALOLA_GRAVELER, 25, null, null)],
  [Species.ALOLA_GRAVELER]: [
    new SpeciesEvolution(Species.ALOLA_GOLEM, 1, EvolutionItem.LINKING_CORD, null, GENERIC_ITEM_EVO_LEVEL),
  ],
  [Species.ALOLA_GRIMER]: [new SpeciesEvolution(Species.ALOLA_MUK, 38, null, null)],
};
