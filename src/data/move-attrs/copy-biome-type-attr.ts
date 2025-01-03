import { Biome } from "#enums/biome";
import { TerrainType } from "#enums/terrain-type";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to change the user's type based on the current biome.
 * If terrain is active, the user's type is changed to match the terrain instead.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Camouflage_(move) Camouflage}.
 * @extends MoveEffectAttr
 */
export class CopyBiomeTypeAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const terrainType = globalScene.arena.getTerrainType();
    let typeChange: Type;
    if (terrainType !== TerrainType.NONE) {
      typeChange = this.getTypeForTerrain(globalScene.arena.getTerrainType());
    } else {
      typeChange = this.getTypeForBiome(globalScene.arena.biomeType);
    }

    user.summonData.types = [typeChange];
    user.updateInfo();

    globalScene.queueMessage(
      i18next.t("moveTriggers:transformedIntoType", {
        pokemonName: getPokemonNameWithAffix(user),
        typeName: i18next.t(`pokemonInfo:Type.${Type[typeChange]}`),
      }),
    );

    return true;
  }

  /**
   * Retrieves a type from the current terrain
   * @param terrainType {@linkcode TerrainType}
   * @returns the {@linkcode Type} corresponding to the terrain
   */
  private getTypeForTerrain(terrainType: TerrainType): Type {
    switch (terrainType) {
      case TerrainType.ELECTRIC:
        return Type.ELECTRIC;
      case TerrainType.MISTY:
        return Type.FAIRY;
      case TerrainType.GRASSY:
        return Type.GRASS;
      case TerrainType.PSYCHIC:
        return Type.PSYCHIC;
      case TerrainType.NONE:
      default:
        return Type.UNKNOWN;
    }
  }

  /**
   * Retrieves a type from the current biome
   * @param biomeType {@linkcode Biome}
   * @returns the {@linkcode Type} corresponding to the biome
   */
  private getTypeForBiome(biomeType: Biome): Type {
    switch (biomeType) {
      case Biome.TOWN:
      case Biome.PLAINS:
      case Biome.METROPOLIS:
        return Type.NORMAL;
      case Biome.GRASS:
      case Biome.TALL_GRASS:
        return Type.GRASS;
      case Biome.FOREST:
      case Biome.JUNGLE:
        return Type.BUG;
      case Biome.SLUM:
      case Biome.SWAMP:
        return Type.POISON;
      case Biome.SEA:
      case Biome.BEACH:
      case Biome.LAKE:
      case Biome.SEABED:
        return Type.WATER;
      case Biome.MOUNTAIN:
        return Type.FLYING;
      case Biome.BADLANDS:
        return Type.GROUND;
      case Biome.CAVE:
      case Biome.DESERT:
        return Type.ROCK;
      case Biome.ICE_CAVE:
      case Biome.SNOWY_FOREST:
        return Type.ICE;
      case Biome.MEADOW:
      case Biome.FAIRY_CAVE:
      case Biome.ISLAND:
        return Type.FAIRY;
      case Biome.POWER_PLANT:
        return Type.ELECTRIC;
      case Biome.VOLCANO:
        return Type.FIRE;
      case Biome.GRAVEYARD:
      case Biome.TEMPLE:
        return Type.GHOST;
      case Biome.DOJO:
      case Biome.CONSTRUCTION_SITE:
        return Type.FIGHTING;
      case Biome.FACTORY:
      case Biome.LABORATORY:
        return Type.STEEL;
      case Biome.RUINS:
      case Biome.SPACE:
        return Type.PSYCHIC;
      case Biome.WASTELAND:
      case Biome.END:
        return Type.DRAGON;
      case Biome.ABYSS:
        return Type.DARK;
      default:
        return Type.UNKNOWN;
    }
  }
}
