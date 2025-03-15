import i18next from "i18next";
import { Biome } from "#enums/biome";
import type { Species } from "#enums/species";
import type { TrainerType } from "#enums/trainer-type";

export function getBiomeName(biome: Biome | -1) {
  if (biome === -1) {
    return i18next.t("biome:unknownLocation");
  }
  switch (biome) {
    case Biome.GRASS:
      return i18next.t("biome:GRASS");
    case Biome.RUINS:
      return i18next.t("biome:RUINS");
    case Biome.END:
      return i18next.t("biome:END");
    default:
      return i18next.t(`biome:${Biome[biome].toUpperCase()}`);
  }
}

interface BiomeDepths {
  [key: number]: [number, number];
}

export const biomeDepths: BiomeDepths = {};

export interface SpeciesTree {
  [key: number]: Species[];
}

export interface PokemonPools {
  [key: number]: (Species | SpeciesTree)[];
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
