import { Biome } from "#enums/biome";
import { TerrainType } from "#enums/terrain-type";
import { ElementType } from "#enums/element-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to change the user's type based on the current biome.
 * If terrain is active, the user's type is changed to match the terrain instead.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Camouflage_(move) | Camouflage}.
 * @extends MoveEffectAttr
 */
export class CopyBiomeTypeAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const terrainType = globalScene.arena.getTerrainType();
    let typeChange: ElementType;
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
        typeName: i18next.t(`pokemonInfo:Type.${ElementType[typeChange]}`),
      }),
    );

    return true;
  }

  /**
   * Retrieves a type from the current terrain
   * @param terrainType {@linkcode TerrainType}
   * @returns the {@linkcode ElementType} corresponding to the terrain
   */
  private getTypeForTerrain(terrainType: TerrainType): ElementType {
    switch (terrainType) {
      case TerrainType.ELECTRIC:
        return ElementType.ELECTRIC;
      case TerrainType.MISTY:
        return ElementType.FAIRY;
      case TerrainType.GRASSY:
        return ElementType.GRASS;
      case TerrainType.PSYCHIC:
        return ElementType.PSYCHIC;
      case TerrainType.NONE:
      default:
        return ElementType.UNKNOWN;
    }
  }

  /**
   * Retrieves a type from the current biome
   * @param biomeType {@linkcode Biome}
   * @returns the {@linkcode ElementType} corresponding to the biome
   */
  private getTypeForBiome(biomeType: Biome): ElementType {
    switch (biomeType) {
      case Biome.TOWN:
      case Biome.PLAINS:
      case Biome.METROPOLIS:
        return ElementType.NORMAL;
      case Biome.GRASS:
      case Biome.TALL_GRASS:
        return ElementType.GRASS;
      case Biome.FOREST:
      case Biome.JUNGLE:
        return ElementType.BUG;
      case Biome.SLUM:
      case Biome.SWAMP:
        return ElementType.POISON;
      case Biome.SEA:
      case Biome.BEACH:
      case Biome.LAKE:
      case Biome.SEABED:
        return ElementType.WATER;
      case Biome.MOUNTAIN:
        return ElementType.FLYING;
      case Biome.BADLANDS:
        return ElementType.GROUND;
      case Biome.CAVE:
      case Biome.DESERT:
        return ElementType.ROCK;
      case Biome.ICE_CAVE:
      case Biome.SNOWY_FOREST:
        return ElementType.ICE;
      case Biome.MEADOW:
      case Biome.FAIRY_CAVE:
      case Biome.ISLAND:
        return ElementType.FAIRY;
      case Biome.POWER_PLANT:
        return ElementType.ELECTRIC;
      case Biome.VOLCANO:
        return ElementType.FIRE;
      case Biome.GRAVEYARD:
      case Biome.TEMPLE:
        return ElementType.GHOST;
      case Biome.DOJO:
      case Biome.CONSTRUCTION_SITE:
        return ElementType.FIGHTING;
      case Biome.FACTORY:
      case Biome.LABORATORY:
        return ElementType.STEEL;
      case Biome.RUINS:
      case Biome.SPACE:
        return ElementType.PSYCHIC;
      case Biome.WASTELAND:
      case Biome.END:
        return ElementType.DRAGON;
      case Biome.ABYSS:
        return ElementType.DARK;
      default:
        return ElementType.UNKNOWN;
    }
  }
}
