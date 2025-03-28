import { abyssBiome } from "#app/data/biomes/abyss";
import { badlandsBiome } from "#app/data/biomes/badlands";
import { beachBiome } from "#app/data/biomes/beach";
import { caveBiome } from "#app/data/biomes/cave";
import { constructionSiteBiome } from "#app/data/biomes/construction-site";
import { desertBiome } from "#app/data/biomes/desert";
import { dojoBiome } from "#app/data/biomes/dojo";
import { endBiome } from "#app/data/biomes/end";
import { factoryBiome } from "#app/data/biomes/factory";
import { fairyCave } from "#app/data/biomes/fairy-cave";
import { forestBiome } from "#app/data/biomes/forest";
import { grassBiome } from "#app/data/biomes/grass";
import { graveyardBiome } from "#app/data/biomes/graveyard";
import { iceCaveBiome } from "#app/data/biomes/ice-cave";
import { islandBiome } from "#app/data/biomes/island";
import { jungleBiome } from "#app/data/biomes/jungle";
import { laboratoryBiome } from "#app/data/biomes/laboratory";
import { lakeBiome } from "#app/data/biomes/lake";
import { meadowBiome } from "#app/data/biomes/meadow";
import { metropolisBiome } from "#app/data/biomes/metropolis";
import { mountainBiome } from "#app/data/biomes/mountain";
import { plainsBiome } from "#app/data/biomes/plains";
import { powerPlantBiome } from "#app/data/biomes/power-plant";
import { ruinsBiome } from "#app/data/biomes/ruins";
import { seaBiome } from "#app/data/biomes/sea";
import { seabedBiome } from "#app/data/biomes/seabed";
import { slumBiome } from "#app/data/biomes/slum";
import { snowyForestBiome } from "#app/data/biomes/snowy-forest";
import { spaceBiome } from "#app/data/biomes/space";
import { swampBiome } from "#app/data/biomes/swamp";
import { tallGrassBiome } from "#app/data/biomes/tall-grass";
import { templeBiome } from "#app/data/biomes/temple";
import { townBiome } from "#app/data/biomes/town";
import { volcanoBiome } from "#app/data/biomes/volcano";
import { wastelandBiome } from "#app/data/biomes/wasteland";
import { allBiomes } from "#app/data/data-lists";

export function initBiomes() {
  const rawAllBiomes = [
    townBiome,
    plainsBiome,
    grassBiome,
    tallGrassBiome,
    metropolisBiome,
    forestBiome,
    seaBiome,
    swampBiome,
    beachBiome,
    lakeBiome,
    seabedBiome,
    mountainBiome,
    badlandsBiome,
    caveBiome,
    desertBiome,
    iceCaveBiome,
    meadowBiome,
    powerPlantBiome,
    volcanoBiome,
    graveyardBiome,
    dojoBiome,
    factoryBiome,
    ruinsBiome,
    wastelandBiome,
    abyssBiome,
    spaceBiome,
    constructionSiteBiome,
    jungleBiome,
    fairyCave,
    templeBiome,
    slumBiome,
    snowyForestBiome,
    islandBiome,
    laboratoryBiome,
    endBiome,
  ];

  for (const biome of rawAllBiomes) {
    allBiomes.set(biome.biomeId, biome);
  }
}
