import { Battle } from "#app/battle";
import type { BattleScene } from "#app/battle-scene";
import { getGameMode } from "#app/game-mode";
import { BattleType } from "#enums/battle-type";
import { GameModes } from "#enums/game-modes";
import { Gender } from "#enums/gender";
import { MoveId } from "#enums/move-id";
import type { SpeciesId } from "#enums/species-id";
import { PlayerPokemon } from "#field/player-pokemon";
import type { StarterConfig, StarterMoveset } from "#types/starter-data";
import { getPokemonSpecies, getPokemonSpeciesForm } from "#utils/pokemon-utils";

/** Function to convert Blob to string */
export function blobToString(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("Error reading Blob as string"));
    };

    reader.readAsText(blob);
  });
}

export function holdOn(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateStarter(scene: BattleScene, species: SpeciesId[]): StarterConfig[] {
  const starters = getTestRunStarters(species);
  const startingLevel = scene.gameMode.getStartingLevel();
  if (species.length > 6) {
    console.warn("Don't pass more than 6 starters to `runToSummon` or `startBattle`! Recieved length:", species.length);
    species.splice(6);
  }
  for (const starter of starters) {
    const starterProps = scene.gameData.getSpeciesDexAttrProps(starter.species, starter.dexAttr);
    const starterFormIndex = Math.min(starterProps.formIndex, Math.max(starter.species.forms.length - 1, 0));
    const starterPokemon = scene.addPlayerPokemon(
      starter.species,
      startingLevel,
      starter.abilityIndex,
      starterFormIndex,
      starterProps.gender,
      starterProps.shiny,
      starterProps.variant,
      undefined,
      starter.nature,
    );
    const moveset: MoveId[] = [];
    for (const move of starterPokemon.getMoveset(true)) {
      moveset.push(move.getMove().id);
    }
    starter.moveset = moveset as StarterMoveset;
  }
  return starters;
}

function getTestRunStarters(species: SpeciesId[]): StarterConfig[] {
  const starters: StarterConfig[] = [];
  const startingLevel = getGameMode(GameModes.CLASSIC).getStartingLevel();

  for (const specie of species) {
    const starterSpeciesForm = getPokemonSpeciesForm(specie, 0);
    const starterSpecies = getPokemonSpecies(starterSpeciesForm.speciesId);
    const pokemon = new PlayerPokemon(starterSpecies, startingLevel, undefined, 0);
    const starter: StarterConfig = {
      species: starterSpecies,
      dexAttr: pokemon.getDexAttr(),
      abilityIndex: pokemon.abilityIndex,
      passive: false,
      nature: pokemon.getNature(),
      pokerus: pokemon.pokerus,
    };
    starters.push(starter);
  }
  return starters;
}

export function waitUntil(truth): Promise<unknown> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (truth()) {
        clearInterval(interval);
        resolve(true);
      }
    }, 1000);
  });
}

/** Get the index of `move` from the moveset of the pokemon on the player's field at location `pokemonIndex` */
export function getMovePosition(scene: BattleScene, pokemonIndex: 0 | 1, moveId: MoveId): number {
  const playerPokemon = scene.getPlayerField()[pokemonIndex];
  const moveSet = playerPokemon.getMoveset();
  const index = moveSet.findIndex((m) => m.moveId === moveId && m.ppUsed < m.getMovePp());
  console.log(`Move position for ${MoveId[moveId]} (=${moveId}):`, index);
  return index;
}

/**
 * Useful for populating party, wave index, etc. without having to spin up and run through an entire EncounterPhase
 */
export function initSceneWithoutEncounterPhase(scene: BattleScene, species: SpeciesId[]): void {
  const starters = generateStarter(scene, species);
  starters.forEach((starter) => {
    const starterProps = scene.gameData.getSpeciesDexAttrProps(starter.species, starter.dexAttr);
    const starterFormIndex = Math.min(starterProps.formIndex, Math.max(starter.species.forms.length - 1, 0));
    const starterGender = Gender.MALE;
    const starterSpeciesId = starter.species.getRootSpeciesId(true);
    const starterIvs = scene.gameData.starterData[starterSpeciesId].ivs.slice(0);
    const starterPokemon = scene.addPlayerPokemon(
      starter.species,
      scene.gameMode.getStartingLevel(),
      starter.abilityIndex,
      starterFormIndex,
      starterGender,
      starterProps.shiny,
      starterProps.variant,
      starterIvs,
      starter.nature,
    );
    starter.moveset && starterPokemon.tryPopulateMoveset(starter.moveset);
    scene.getPlayerParty().push(starterPokemon);
  });

  scene.currentBattle = new Battle(getGameMode(GameModes.CLASSIC), 5, BattleType.WILD, undefined, false);
}
