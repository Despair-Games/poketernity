import { SpeciesId } from "#enums/species-id";
import {
  DayEvolutionCondition,
  FemaleEvolutionCondition,
  MaleEvolutionCondition,
  type PokemonEvolutions,
  SpeciesEvolution,
  SpeciesFriendshipEvolutionCondition,
} from "#app/data/pokemon-evolutions";
import { HAPPINESS_EVO_LEVEL } from "#app/data/pokemon-evolutions/enemy-pokemon-evolution-levels";

export const gen4pokemonFamilyEvolutions: PokemonEvolutions = {
  [SpeciesId.TURTWIG]: [new SpeciesEvolution(SpeciesId.GROTLE, 18, null, null)],
  [SpeciesId.GROTLE]: [new SpeciesEvolution(SpeciesId.TORTERRA, 32, null, null)],
  [SpeciesId.CHIMCHAR]: [new SpeciesEvolution(SpeciesId.MONFERNO, 14, null, null)],
  [SpeciesId.MONFERNO]: [new SpeciesEvolution(SpeciesId.INFERNAPE, 36, null, null)],
  [SpeciesId.PIPLUP]: [new SpeciesEvolution(SpeciesId.PRINPLUP, 16, null, null)],
  [SpeciesId.PRINPLUP]: [new SpeciesEvolution(SpeciesId.EMPOLEON, 36, null, null)],
  [SpeciesId.STARLY]: [new SpeciesEvolution(SpeciesId.STARAVIA, 14, null, null)],
  [SpeciesId.STARAVIA]: [new SpeciesEvolution(SpeciesId.STARAPTOR, 34, null, null)],
  [SpeciesId.BIDOOF]: [new SpeciesEvolution(SpeciesId.BIBAREL, 15, null, null)],
  [SpeciesId.KRICKETOT]: [new SpeciesEvolution(SpeciesId.KRICKETUNE, 10, null, null)],
  [SpeciesId.SHINX]: [new SpeciesEvolution(SpeciesId.LUXIO, 15, null, null)],
  [SpeciesId.LUXIO]: [new SpeciesEvolution(SpeciesId.LUXRAY, 30, null, null)],
  [SpeciesId.CRANIDOS]: [new SpeciesEvolution(SpeciesId.RAMPARDOS, 30, null, null)],
  [SpeciesId.SHIELDON]: [new SpeciesEvolution(SpeciesId.BASTIODON, 30, null, null)],
  [SpeciesId.BURMY]: [
    new SpeciesEvolution(SpeciesId.MOTHIM, 20, null, [new MaleEvolutionCondition()]),
    new SpeciesEvolution(SpeciesId.WORMADAM, 20, null, [new FemaleEvolutionCondition()]),
  ],
  [SpeciesId.COMBEE]: [new SpeciesEvolution(SpeciesId.VESPIQUEN, 21, null, [new FemaleEvolutionCondition()])],
  [SpeciesId.BUIZEL]: [new SpeciesEvolution(SpeciesId.FLOATZEL, 26, null, null)],
  [SpeciesId.CHERUBI]: [new SpeciesEvolution(SpeciesId.CHERRIM, 25, null, null)],
  [SpeciesId.SHELLOS]: [new SpeciesEvolution(SpeciesId.GASTRODON, 30, null, null)],
  [SpeciesId.DRIFLOON]: [new SpeciesEvolution(SpeciesId.DRIFBLIM, 28, null, null)],
  [SpeciesId.BUNEARY]: [
    new SpeciesEvolution(SpeciesId.LOPUNNY, 1, null, [new SpeciesFriendshipEvolutionCondition()], HAPPINESS_EVO_LEVEL),
  ],
  [SpeciesId.GLAMEOW]: [new SpeciesEvolution(SpeciesId.PURUGLY, 38, null, null)],
  [SpeciesId.STUNKY]: [new SpeciesEvolution(SpeciesId.SKUNTANK, 34, null, null)],
  [SpeciesId.BRONZOR]: [new SpeciesEvolution(SpeciesId.BRONZONG, 33, null, null)],
  [SpeciesId.GIBLE]: [new SpeciesEvolution(SpeciesId.GABITE, 24, null, null)],
  [SpeciesId.GABITE]: [new SpeciesEvolution(SpeciesId.GARCHOMP, 48, null, null)],
  [SpeciesId.RIOLU]: [
    new SpeciesEvolution(
      SpeciesId.LUCARIO,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(), new DayEvolutionCondition()],
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [SpeciesId.HIPPOPOTAS]: [new SpeciesEvolution(SpeciesId.HIPPOWDON, 34, null, null)],
  [SpeciesId.SKORUPI]: [new SpeciesEvolution(SpeciesId.DRAPION, 40, null, null)],
  [SpeciesId.CROAGUNK]: [new SpeciesEvolution(SpeciesId.TOXICROAK, 37, null, null)],
  [SpeciesId.FINNEON]: [new SpeciesEvolution(SpeciesId.LUMINEON, 31, null, null)],
  [SpeciesId.SNOVER]: [new SpeciesEvolution(SpeciesId.ABOMASNOW, 40, null, null)],
};
