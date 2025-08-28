import { api } from "#api/api";
import { globalScene } from "#app/global-scene";
import type { PokemonSpecies } from "#data/pokemon-species";
import type { PokemonSpeciesForm } from "#data/pokemon-species-form";
import { speciesStarterCosts } from "#data/starters";
import type { SpeciesId } from "#enums/species-id";
import { PlayerPokemon } from "#field/player-pokemon";
import type { StarterConfig } from "#types/starter-data";
import { getPokemonSpecies, getPokemonSpeciesForm } from "#utils/pokemon-utils";
import { randSeedGauss, randSeedInt, randSeedItem } from "#utils/random-utils";

export interface DailyRunConfig {
  seed: number;
  starters: StarterConfig;
}

export function fetchDailyRunSeed(): Promise<string | null> {
  return new Promise<string | null>((resolve, _reject) => {
    api.daily.getSeed().then((dailySeed) => {
      resolve(dailySeed);
    });
  });
}

export function getDailyRunStarters(seed: string): StarterConfig[] {
  const starters: StarterConfig[] = [];

  globalScene.executeWithSeedOffset(
    () => {
      const startingLevel = globalScene.gameMode.getStartingLevel();

      if (/\d{18}$/.test(seed)) {
        for (let s = 0; s < 3; s++) {
          const offset = 6 + s * 6;
          const starterSpeciesForm = getPokemonSpeciesForm(
            Number.parseInt(seed.slice(offset, offset + 4)) as SpeciesId,
            Number.parseInt(seed.slice(offset + 4, offset + 6)),
          );
          starters.push(getDailyRunStarter(starterSpeciesForm, startingLevel));
        }
        return;
      }

      const starterCosts: number[] = [];
      starterCosts.push(Math.min(Math.round(3.5 + Math.abs(randSeedGauss(1))), 8));
      starterCosts.push(randSeedInt(9 - starterCosts[0], 1));
      starterCosts.push(10 - (starterCosts[0] + starterCosts[1]));

      for (const cost of starterCosts) {
        const costSpecies = Object.keys(speciesStarterCosts)
          .map((s) => Number.parseInt(s, 10) as SpeciesId)
          .filter((s) => speciesStarterCosts[s] === cost);
        const randPkmSpecies = getPokemonSpecies(randSeedItem(costSpecies));
        const starterSpecies = getPokemonSpecies(randPkmSpecies.getEnemySpeciesForLevel(startingLevel, true));
        starters.push(getDailyRunStarter(starterSpecies, startingLevel));
      }
    },
    0,
    seed,
  );

  return starters;
}

function getDailyRunStarter(starterSpeciesForm: PokemonSpeciesForm, startingLevel: number): StarterConfig {
  const starterSpecies =
    starterSpeciesForm.type === "PokemonSpecies"
      ? (starterSpeciesForm as PokemonSpecies)
      : getPokemonSpecies(starterSpeciesForm.speciesId);
  const formIndex = starterSpeciesForm.type === "PokemonSpecies" ? undefined : starterSpeciesForm.formIndex;
  const pokemon = new PlayerPokemon(
    starterSpecies,
    startingLevel,
    undefined,
    formIndex,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  );
  const starter: StarterConfig = {
    species: starterSpecies,
    dexAttr: pokemon.getDexAttr(),
    abilityIndex: pokemon.abilityIndex,
    passive: false,
    nature: pokemon.getNature(),
    pokerus: pokemon.pokerus,
  };
  pokemon.destroy();
  return starter;
}
