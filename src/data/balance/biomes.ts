import i18next from "i18next";
import { Biome } from "#enums/biome";

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
