import { allBiomes } from "#data/data-lists";
import { BiomeId } from "#enums/biome-id";
import type { SpeciesId } from "#enums/species-id";
import type { TrainerType } from "#enums/trainer-type";
import { enumValueToKey } from "#utils/common-utils";
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
      return i18next.t(`biome:${enumValueToKey(BiomeId, biomeId).toUpperCase()}`);
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
export const IndoorBiomes = Object.freeze<BiomeId[]>([
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
]);

// #region Alcremie Evolutions

/** The biome determines what form Alcremie will be when evolving */
export const VanillaAlcremieBiomes = Object.freeze<BiomeId[]>([
  BiomeId.TOWN,
  BiomeId.PLAINS,
  BiomeId.GRASS,
  BiomeId.TALL_GRASS,
  BiomeId.METROPOLIS,
]);
export const RubyAlcremieBiomes = Object.freeze<BiomeId[]>([
  BiomeId.BADLANDS,
  BiomeId.VOLCANO,
  BiomeId.STEAM_VENT,
  BiomeId.GRAVEYARD,
  BiomeId.FACTORY,
  BiomeId.SLUM,
]);
export const MatchaAlcremieBiomes = Object.freeze<BiomeId[]>([
  BiomeId.FOREST,
  BiomeId.SWAMP,
  BiomeId.MEADOW,
  BiomeId.JUNGLE,
]);
export const MintAlcremieBiomes = Object.freeze<BiomeId[]>([BiomeId.SEA, BiomeId.BEACH, BiomeId.LAKE, BiomeId.SEABED]);
export const LemonAlcremieBiomes = Object.freeze<BiomeId[]>([
  BiomeId.DESERT,
  BiomeId.POWER_PLANT,
  BiomeId.CHARGESTONE_CAVE,
  BiomeId.DOJO,
  BiomeId.RUINS,
  BiomeId.CONSTRUCTION_SITE,
]);
export const SaltedCreamAlcremieBiomes = Object.freeze<BiomeId[]>([
  BiomeId.MOUNTAIN,
  BiomeId.CAVE,
  BiomeId.ICE_CAVE,
  BiomeId.FAIRY_CAVE,
  BiomeId.SNOWY_FOREST,
]);
export const RubySwirlAlcremieBiomes = Object.freeze<BiomeId[]>([BiomeId.WASTELAND, BiomeId.LABORATORY]);
export const CaramelSwirlAlcremieBiomes = Object.freeze<BiomeId[]>([BiomeId.TEMPLE, BiomeId.ISLAND]);
export const RainbowSwirlAlcremieBiomes = Object.freeze<BiomeId[]>([BiomeId.SPACE, BiomeId.ABYSS, BiomeId.END]);

// #region ME biome mappings
/**
 * Biomes in here get access to {@linkcode extremeBiomeEncounters} (nothing right now)
 */
export const ExtremeEncounterBiomes = Object.freeze<BiomeId[]>([
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
]);

/**
 * Biomes in here get access to {@linkcode nonExtremeBiomeEncounters}
 * - Field Trip
 * - Dancing Lessons
 */
export const NonExtremeEncounterBiomes = Object.freeze<BiomeId[]>([
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
  BiomeId.CHARGESTONE_CAVE,
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
]);

/**
 * Biomes in here get access to {@linkcode humanTransitableBiomeEncounters}
 * - Mysterious Challengers
 * - Shady vitamin seller
 * - Pokemon salesman
 * - Offer you can't refuse
 * - Winstrate challenge
 * - Expert Breeder
 */
export const HumanTransitableBiomes = Object.freeze<BiomeId[]>([
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
]);

/**
 * Biomes in here get access to {@linkcode civilizationBiomeEncounters}
 * - Department store sale
 * - Part timer
 * - Fun and games
 * - Global Trade System
 */
export const CivilizationEncounterBiomes = Object.freeze<BiomeId[]>([
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
]);

// #region dancing-lesson ME

/**
 * Helper function used in dancing-lessons-encounter to get the
 * correct form for an Oricorio based on the biome the ME is encountered in
 * @param biomeId The BiomeId
 * @returns a number representing the Oricorio's form index
 */
export function getOricorioFormIndexForBiome(biomeId: BiomeId): number {
  switch (biomeId) {
    case BiomeId.VOLCANO:
    case BiomeId.STEAM_VENT:
    case BiomeId.BEACH:
    case BiomeId.ISLAND:
    case BiomeId.WASTELAND:
    case BiomeId.MOUNTAIN:
    case BiomeId.BADLANDS:
    case BiomeId.DESERT:
      return 0; // Baille Style (Fire)
    case BiomeId.TOWN:
    case BiomeId.CONSTRUCTION_SITE:
    case BiomeId.POWER_PLANT:
    case BiomeId.CHARGESTONE_CAVE:
    case BiomeId.FACTORY:
    case BiomeId.LABORATORY:
    case BiomeId.SLUM:
    case BiomeId.METROPOLIS:
    case BiomeId.DOJO:
      return 1; // Pom Pom Style (Electric)
    case BiomeId.JUNGLE:
    case BiomeId.FAIRY_CAVE:
    case BiomeId.MEADOW:
    case BiomeId.PLAINS:
    case BiomeId.GRASS:
    case BiomeId.TALL_GRASS:
    case BiomeId.FOREST:
    case BiomeId.SPACE:
    case BiomeId.END:
      return 2; // Pau style (Psychic)
    case BiomeId.RUINS:
    case BiomeId.SWAMP:
    case BiomeId.CAVE:
    case BiomeId.ABYSS:
    case BiomeId.GRAVEYARD:
    case BiomeId.LAKE:
    case BiomeId.TEMPLE:
    case BiomeId.SEA:
    case BiomeId.SEABED:
    case BiomeId.ICE_CAVE:
    case BiomeId.SNOWY_FOREST:
      return 3; // Sensu style (Ghost)
  }
}

// #region teleporting hijinks ME

export const TeleportingHijinksBiomeCandidates = Object.freeze<BiomeId[]>([
  BiomeId.SPACE,
  BiomeId.FAIRY_CAVE,
  BiomeId.LABORATORY,
  BiomeId.ISLAND,
  BiomeId.WASTELAND,
  BiomeId.DOJO,
]);
