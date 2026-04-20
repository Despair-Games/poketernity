import { globalScene } from "#app/global-scene";
import type { Variant } from "#data/variant";
import type { ElementalType } from "#enums/elemental-type";
import type { Gender } from "#enums/gender";
import type { Nature } from "#enums/nature";
import type { SpeciesId } from "#enums/species-id";
import type { PlayerPokemon } from "#field/pokemon";
import type { StarterConfig, StarterMoveset } from "#types/starter-data";
import { getPokemonSpecies } from "#utils/pokemon-utils";

/**
 * Wire-safe representation of a starter Pokemon.
 * Contains all resolved properties needed to reconstruct the Pokemon
 * on the peer's client without requiring their local dex data.
 */
export interface SerializedStarter {
  readonly speciesId: SpeciesId;
  readonly abilityIndex: number;
  readonly passive: boolean;
  readonly nature: Nature;
  readonly moveset?: StarterMoveset;
  readonly pokerus: boolean;
  readonly nickname?: string;
  readonly teraType?: ElementalType;
  // Resolved from dexAttr so peer doesn't need local dex data
  readonly formIndex: number;
  readonly gender: Gender;
  readonly shiny: boolean;
  readonly variant: Variant;
  readonly ivs: number[];
}

/**
 * Serialize a StarterConfig into a wire-safe format.
 * Resolves dexAttr properties using the local player's game data
 * so the peer can reconstruct the Pokemon without needing dex access.
 */
export function serializeStarter(starter: StarterConfig): SerializedStarter {
  const { gameData } = globalScene;
  const { species, dexAttr, abilityIndex, passive, nature, moveset, pokerus, nickname, teraType } = starter;

  const starterProps = gameData.getSpeciesDexAttrProps(species, dexAttr);
  const formIndex = Math.min(starterProps.formIndex, Math.max(species.forms.length - 1, 0));

  const starterSpeciesId = species.getRootSpeciesId(true);
  const ivs = gameData.starterData[starterSpeciesId]?.ivs?.slice(0) ?? [0, 0, 0, 0, 0, 0];

  return {
    speciesId: species.speciesId,
    abilityIndex,
    passive,
    nature,
    moveset,
    pokerus,
    nickname,
    teraType,
    formIndex,
    gender: starterProps.gender,
    shiny: starterProps.shiny,
    variant: starterProps.variant,
    ivs,
  };
}

/**
 * Serialize an array of StarterConfig into a JSON string for network transmission.
 */
export function serializeStarters(starters: StarterConfig[]): string {
  return JSON.stringify(starters.map(serializeStarter));
}

/**
 * Reconstruct PlayerPokemon instances from serialized starter data.
 * Used by both the local player (for consistency) and the peer.
 *
 * @param starterDataJson - JSON string of SerializedStarter[]
 * @param ownerUserId - The userId of the player who owns these starters
 * @returns Array of created PlayerPokemon (not yet added to party — caller must interleave)
 */
export async function createPokemonFromSerializedStarters(
  starterDataJson: string,
  ownerUserId: string,
): Promise<PlayerPokemon[]> {
  const starters: SerializedStarter[] = JSON.parse(starterDataJson);
  const { gameMode } = globalScene;
  const pokemons: PlayerPokemon[] = [];
  const loadPromises: Promise<void>[] = [];

  for (const starter of starters) {
    const species = getPokemonSpecies(starter.speciesId);
    if (!species) {
      console.warn(`[MP] Could not find species ${starter.speciesId}`);
      continue;
    }

    const pokemon = globalScene.addPlayerPokemon(species, gameMode.getStartingLevel(), {
      abilityIndex: starter.abilityIndex,
      formIndex: starter.formIndex,
      gender: starter.gender,
      shiny: starter.shiny,
      variant: starter.variant,
      ivs: starter.ivs,
      nature: starter.nature,
    });

    // Apply moveset directly (bypass validation since peer may not have egg move data)
    if (starter.moveset) {
      pokemon.setMoveset(...starter.moveset);
    }

    if (starter.passive) {
      pokemon.passive = true;
    }

    if (starter.pokerus) {
      pokemon.pokerus = true;
    }

    if (starter.nickname) {
      pokemon.nickname = starter.nickname;
    }

    if (starter.teraType == null) {
      pokemon.teraType = pokemon.species.type1;
    } else {
      pokemon.teraType = starter.teraType;
    }

    // Tag this Pokemon with its owner for command control
    pokemon.mpOwnerUserId = ownerUserId;

    pokemon.setVisible(false);
    pokemons.push(pokemon);
    loadPromises.push(pokemon.loadAssets());
  }

  await Promise.all(loadPromises);
  return pokemons;
}
