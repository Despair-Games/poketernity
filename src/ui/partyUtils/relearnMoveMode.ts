import type { Pokemon } from "#app/field/pokemon";
import type { Moves } from "#app/enums/moves";
import { speciesEggMoves } from "#app/data/balance/egg-moves";
import { tmSpecies } from "#app/data/balance/tms";

export enum MoveSource {
  LEVEL_UP,
  FUSION_LEVEL_UP,
  EGG,
  TM,
  FUSION_TM,
  MYSTERY_ENCOUNTER,
}

export function retrieveMoveList(pokemon: Pokemon): Moves[] {
  return pokemon.getLearnableLevelMoves();
}

export function determineMoveSource(pokemon: Pokemon, move: Moves): MoveSource {
  const levelMoves = pokemon.getSpeciesForm().getLevelMoves();
  if (levelMoves.find((m) => m[1] === move)) {
    return MoveSource.LEVEL_UP;
  } else if (pokemon.isFusion()) {
    const fusionLevelMoves = pokemon.getFusionSpeciesForm().getLevelMoves();
    if (fusionLevelMoves.find((m) => m[1] === move)) {
      return MoveSource.FUSION_LEVEL_UP;
    }
  }
  const eggMoves = speciesEggMoves[pokemon.species.speciesId];
  if (eggMoves.find((mv) => mv === move)) {
    return MoveSource.EGG;
  }
  const speciesList = tmSpecies[move];
  if (speciesList) {
    if (speciesList.find((p) => p === pokemon.species.speciesId)) {
      return MoveSource.TM;
    } else if (pokemon.fusionSpecies && speciesList.find((p) => p === pokemon.fusionSpecies!.speciesId)) {
      return MoveSource.FUSION_TM;
    }
  }
  return MoveSource.MYSTERY_ENCOUNTER;
}
