import type { Species } from "#enums/species";
import { globalScene } from "#app/global-scene";
import { PlayerPokemon } from "#app/field/pokemon";
import type { StarterConfig } from "#app/@types/StarterConfig";
import { randSeedGauss, randSeedInt, randSeedItem } from "#app/utils";
import type { PokemonSpeciesForm } from "./pokemon-species-form";
import type PokemonSpecies from "#app/data/pokemon-species";
import { getPokemonSpeciesForm } from "#app/utils/pokemon-species-utils";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import { speciesStarterCosts } from "#app/data/balance/starters";
import { api } from "#app/plugins/api/api";

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
            parseInt(seed.slice(offset, offset + 4)) as Species,
            parseInt(seed.slice(offset + 4, offset + 6)),
          );
          starters.push(getDailyRunStarter(starterSpeciesForm, startingLevel));
        }
        return;
      }

      const starterCosts: number[] = [];
      starterCosts.push(Math.min(Math.round(3.5 + Math.abs(randSeedGauss(1))), 8));
      starterCosts.push(randSeedInt(9 - starterCosts[0], 1));
      starterCosts.push(10 - (starterCosts[0] + starterCosts[1]));

      for (let c = 0; c < starterCosts.length; c++) {
        const cost = starterCosts[c];
        const costSpecies = Object.keys(speciesStarterCosts)
          .map((s) => parseInt(s) as Species)
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
