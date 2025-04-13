import { allBiomes } from "#app/data/data-lists";
import { BiomeId } from "#enums/biome-id";
import type { SpeciesId } from "#enums/species-id";
import type { TrainerType } from "#enums/trainer-type";
import i18next from "i18next";

export function getBiomeName(biomeId: BiomeId | -1) {
  if (biomeId === -1) {
    return i18next.t("biome:unknownLocation");
  }
  switch (biomeId) {
    case BiomeId.GRASS:
      return i18next.t("biome:GRASS");
    case BiomeId.RUINS:
      return i18next.t("biome:RUINS");
    case BiomeId.END:
      return i18next.t("biome:END");
    default:
      return i18next.t(`biome:${BiomeId[biomeId].toUpperCase()}`);
  }
}

/**
 * Gets the string bgm of a biome Id
 * @param biomeId
 * @returns the bgm of the biome with the id
 */
export function getBiomeBgm(biomeId: BiomeId): string {
  return allBiomes.get(biomeId).bgm;
}

// TODO: See if we can delete the following interfaces
export interface PokemonPools {
  [key: number]: SpeciesId[];
}

export interface BiomeTierPokemonPools {
  [key: number]: PokemonPools;
}

export interface BiomePokemonPools {
  [key: number]: BiomeTierPokemonPools;
}

export interface BiomeTierTrainerPools {
  [key: number]: TrainerType[];
}

export interface BiomeTrainerPools {
  [key: number]: BiomeTierTrainerPools;
}

// #region Indoor biomes

/**
 * Whether or not a biome is indoors affects tinting
 */
export const indoorBiomes = [
  BiomeId.SEABED,
  BiomeId.CAVE,
  BiomeId.CHARGESTONE_CAVE,
  BiomeId.ICE_CAVE,
  BiomeId.POWER_PLANT,
  BiomeId.DOJO,
  BiomeId.FACTORY,
  BiomeId.ABYSS,
  BiomeId.FAIRY_CAVE,
  BiomeId.TEMPLE,
  BiomeId.LABORATORY,
];

// #region Alcremie Evolutions

/** The biome determines what form Alcremie will be when evolving */
export const vanillaAlcremieBiomes = [
  BiomeId.TOWN,
  BiomeId.PLAINS,
  BiomeId.GRASS,
  BiomeId.TALL_GRASS,
  BiomeId.METROPOLIS,
];
export const rubyAlcremieBiomes = [
  BiomeId.BADLANDS,
  BiomeId.VOLCANO,
  BiomeId.STEAM_VENT,
  BiomeId.GRAVEYARD,
  BiomeId.FACTORY,
  BiomeId.SLUM,
];
export const matchaAlcremieBiomes = [BiomeId.FOREST, BiomeId.SWAMP, BiomeId.MEADOW, BiomeId.JUNGLE];
export const mintAlcremieBiomes = [BiomeId.SEA, BiomeId.BEACH, BiomeId.LAKE, BiomeId.SEABED];
export const lemonAlcremieBiomes = [
  BiomeId.DESERT,
  BiomeId.POWER_PLANT,
  BiomeId.CHARGESTONE_CAVE,
  BiomeId.DOJO,
  BiomeId.RUINS,
  BiomeId.CONSTRUCTION_SITE,
];
export const saltedCreamAlcremieBiomes = [
  BiomeId.MOUNTAIN,
  BiomeId.CAVE,
  BiomeId.ICE_CAVE,
  BiomeId.FAIRY_CAVE,
  BiomeId.SNOWY_FOREST,
];
export const rubySwirlAlcremieBiomes = [BiomeId.WASTELAND, BiomeId.LABORATORY];
export const caramelSwirlAlcremieBiomes = [BiomeId.TEMPLE, BiomeId.ISLAND];
export const rainbowSwirlAlcremieBiomes = [BiomeId.SPACE, BiomeId.ABYSS, BiomeId.END];

// #region ME biome mappings
export const EXTREME_ENCOUNTER_BIOMES = [
  BiomeId.SEA,
  BiomeId.SEABED,
  BiomeId.BADLANDS,
  BiomeId.DESERT,
  BiomeId.ICE_CAVE,
  BiomeId.VOLCANO,
  BiomeId.WASTELAND,
  BiomeId.ABYSS,
  BiomeId.SPACE,
  BiomeId.END,
];

export const NON_EXTREME_ENCOUNTER_BIOMES = [
  BiomeId.TOWN,
  BiomeId.PLAINS,
  BiomeId.GRASS,
  BiomeId.TALL_GRASS,
  BiomeId.METROPOLIS,
  BiomeId.FOREST,
  BiomeId.SWAMP,
  BiomeId.BEACH,
  BiomeId.LAKE,
  BiomeId.MOUNTAIN,
  BiomeId.CAVE,
  BiomeId.MEADOW,
  BiomeId.POWER_PLANT,
  BiomeId.GRAVEYARD,
  BiomeId.DOJO,
  BiomeId.FACTORY,
  BiomeId.RUINS,
  BiomeId.CONSTRUCTION_SITE,
  BiomeId.JUNGLE,
  BiomeId.FAIRY_CAVE,
  BiomeId.TEMPLE,
  BiomeId.SLUM,
  BiomeId.SNOWY_FOREST,
  BiomeId.ISLAND,
  BiomeId.LABORATORY,
];
/**
 * Places where you could very reasonably expect to encounter a single human
 *
 * Diff from NON_EXTREME_ENCOUNTER_BIOMES:
 * + BADLANDS
 * + DESERT
 * + ICE_CAVE
 */

export const HUMAN_TRANSITABLE_BIOMES = [
  BiomeId.TOWN,
  BiomeId.PLAINS,
  BiomeId.GRASS,
  BiomeId.TALL_GRASS,
  BiomeId.METROPOLIS,
  BiomeId.FOREST,
  BiomeId.SWAMP,
  BiomeId.BEACH,
  BiomeId.LAKE,
  BiomeId.MOUNTAIN,
  BiomeId.BADLANDS,
  BiomeId.CAVE,
  BiomeId.CHARGESTONE_CAVE,
  BiomeId.STEAM_VENT,
  BiomeId.DESERT,
  BiomeId.ICE_CAVE,
  BiomeId.MEADOW,
  BiomeId.POWER_PLANT,
  BiomeId.GRAVEYARD,
  BiomeId.DOJO,
  BiomeId.FACTORY,
  BiomeId.RUINS,
  BiomeId.CONSTRUCTION_SITE,
  BiomeId.JUNGLE,
  BiomeId.FAIRY_CAVE,
  BiomeId.TEMPLE,
  BiomeId.SLUM,
  BiomeId.SNOWY_FOREST,
  BiomeId.ISLAND,
  BiomeId.LABORATORY,
];
/**
 * Places where you could expect a town or city, some form of large civilization
 */

export const CIVILIZATION_ENCOUNTER_BIOMES = [
  BiomeId.TOWN,
  BiomeId.PLAINS,
  BiomeId.GRASS,
  BiomeId.TALL_GRASS,
  BiomeId.METROPOLIS,
  BiomeId.BEACH,
  BiomeId.LAKE,
  BiomeId.MEADOW,
  BiomeId.POWER_PLANT,
  BiomeId.GRAVEYARD,
  BiomeId.DOJO,
  BiomeId.FACTORY,
  BiomeId.CONSTRUCTION_SITE,
  BiomeId.SLUM,
  BiomeId.ISLAND,
];

// #region dancing-lesson ME

// Fire form
export const BAILE_STYLE_BIOMES = [
  BiomeId.VOLCANO,
  BiomeId.STEAM_VENT,
  BiomeId.BEACH,
  BiomeId.ISLAND,
  BiomeId.WASTELAND,
  BiomeId.MOUNTAIN,
  BiomeId.BADLANDS,
  BiomeId.DESERT,
];

// Electric form
export const POM_POM_STYLE_BIOMES = [
  BiomeId.CONSTRUCTION_SITE,
  BiomeId.POWER_PLANT,
  BiomeId.CHARGESTONE_CAVE,
  BiomeId.FACTORY,
  BiomeId.LABORATORY,
  BiomeId.SLUM,
  BiomeId.METROPOLIS,
  BiomeId.DOJO,
];

// Psychic form
export const PAU_STYLE_BIOMES = [
  BiomeId.JUNGLE,
  BiomeId.FAIRY_CAVE,
  BiomeId.MEADOW,
  BiomeId.PLAINS,
  BiomeId.GRASS,
  BiomeId.TALL_GRASS,
  BiomeId.FOREST,
];

// Ghost form
export const SENSU_STYLE_BIOMES = [
  BiomeId.RUINS,
  BiomeId.SWAMP,
  BiomeId.CAVE,
  BiomeId.ABYSS,
  BiomeId.GRAVEYARD,
  BiomeId.LAKE,
  BiomeId.TEMPLE,
];

// #region teleporting hijinks ME

export const TELEPORTING_HIJINKS_BIOME_CANDIDATES = [
  BiomeId.SPACE,
  BiomeId.FAIRY_CAVE,
  BiomeId.LABORATORY,
  BiomeId.ISLAND,
  BiomeId.WASTELAND,
  BiomeId.DOJO,
];
