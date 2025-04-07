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
