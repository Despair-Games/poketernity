import { Species } from "#enums/species";
import {
  DayEvolutionCondition,
  FemaleEvolutionCondition,
  MaleEvolutionCondition,
  type PokemonEvolutions,
  SpeciesEvolution,
  SpeciesFriendshipEvolutionCondition,
} from "#app/data/pokemon-evolutions";
import { HAPPINESS_EVO_LEVEL } from "#app/data/balance/pokemon-evolutions/enemy-pokemon-evolution-levels";

export const gen4pokemonFamilyEvolutions: PokemonEvolutions = {
  [Species.TURTWIG]: [new SpeciesEvolution(Species.GROTLE, 18, null, null)],
  [Species.GROTLE]: [new SpeciesEvolution(Species.TORTERRA, 32, null, null)],
  [Species.CHIMCHAR]: [new SpeciesEvolution(Species.MONFERNO, 14, null, null)],
  [Species.MONFERNO]: [new SpeciesEvolution(Species.INFERNAPE, 36, null, null)],
  [Species.PIPLUP]: [new SpeciesEvolution(Species.PRINPLUP, 16, null, null)],
  [Species.PRINPLUP]: [new SpeciesEvolution(Species.EMPOLEON, 36, null, null)],
  [Species.STARLY]: [new SpeciesEvolution(Species.STARAVIA, 14, null, null)],
  [Species.STARAVIA]: [new SpeciesEvolution(Species.STARAPTOR, 34, null, null)],
  [Species.BIDOOF]: [new SpeciesEvolution(Species.BIBAREL, 15, null, null)],
  [Species.KRICKETOT]: [new SpeciesEvolution(Species.KRICKETUNE, 10, null, null)],
  [Species.SHINX]: [new SpeciesEvolution(Species.LUXIO, 15, null, null)],
  [Species.LUXIO]: [new SpeciesEvolution(Species.LUXRAY, 30, null, null)],
  [Species.CRANIDOS]: [new SpeciesEvolution(Species.RAMPARDOS, 30, null, null)],
  [Species.SHIELDON]: [new SpeciesEvolution(Species.BASTIODON, 30, null, null)],
  [Species.BURMY]: [
    new SpeciesEvolution(Species.MOTHIM, 20, null, [new MaleEvolutionCondition()]),
    new SpeciesEvolution(Species.WORMADAM, 20, null, [new FemaleEvolutionCondition()]),
  ],
  [Species.COMBEE]: [new SpeciesEvolution(Species.VESPIQUEN, 21, null, [new FemaleEvolutionCondition()])],
  [Species.BUIZEL]: [new SpeciesEvolution(Species.FLOATZEL, 26, null, null)],
  [Species.CHERUBI]: [new SpeciesEvolution(Species.CHERRIM, 25, null, null)],
  [Species.SHELLOS]: [new SpeciesEvolution(Species.GASTRODON, 30, null, null)],
  [Species.DRIFLOON]: [new SpeciesEvolution(Species.DRIFBLIM, 28, null, null)],
  [Species.BUNEARY]: [
    new SpeciesEvolution(Species.LOPUNNY, 1, null, [new SpeciesFriendshipEvolutionCondition(70)], HAPPINESS_EVO_LEVEL),
  ],
  [Species.GLAMEOW]: [new SpeciesEvolution(Species.PURUGLY, 38, null, null)],
  [Species.STUNKY]: [new SpeciesEvolution(Species.SKUNTANK, 34, null, null)],
  [Species.BRONZOR]: [new SpeciesEvolution(Species.BRONZONG, 33, null, null)],
  [Species.GIBLE]: [new SpeciesEvolution(Species.GABITE, 24, null, null)],
  [Species.GABITE]: [new SpeciesEvolution(Species.GARCHOMP, 48, null, null)],
  [Species.RIOLU]: [
    new SpeciesEvolution(
      Species.LUCARIO,
      1,
      null,
      [new SpeciesFriendshipEvolutionCondition(120), new DayEvolutionCondition()],
      HAPPINESS_EVO_LEVEL,
    ),
  ],
  [Species.HIPPOPOTAS]: [new SpeciesEvolution(Species.HIPPOWDON, 34, null, null)],
  [Species.SKORUPI]: [new SpeciesEvolution(Species.DRAPION, 40, null, null)],
  [Species.CROAGUNK]: [new SpeciesEvolution(Species.TOXICROAK, 37, null, null)],
  [Species.FINNEON]: [new SpeciesEvolution(Species.LUMINEON, 31, null, null)],
  [Species.SNOVER]: [new SpeciesEvolution(Species.ABOMASNOW, 40, null, null)],
};
