import i18next from "i18next";
import type { TrainerType } from "#enums/trainer-type";
import { BiomeId } from "#enums/biome-id";
import { SpeciesId } from "#enums/species-id";

export function getBiomeName(biome: BiomeId | -1) {
  if (biome === -1) {
    return i18next.t("biome:unknownLocation");
  }
  switch (biome) {
    case BiomeId.GRASS:
      return i18next.t("biome:GRASS");
    case BiomeId.RUINS:
      return i18next.t("biome:RUINS");
    case BiomeId.END:
      return i18next.t("biome:END");
    default:
      return i18next.t(`biome:${BiomeId[biome].toUpperCase()}`);
  }
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
