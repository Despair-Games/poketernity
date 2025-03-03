import { Biome } from "#enums/biome";
import { TerrainType } from "#enums/terrain-type";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

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
    let typeChange: ElementalType;
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
        typeName: i18next.t(`pokemonInfo:Type.${ElementalType[typeChange]}`),
      }),
    );

    return true;
  }

  /**
   * Retrieves a type from the current terrain
   * @param terrainType {@linkcode TerrainType}
   * @returns the {@linkcode ElementalType} corresponding to the terrain
   */
  private getTypeForTerrain(terrainType: TerrainType): ElementalType {
    switch (terrainType) {
      case TerrainType.ELECTRIC:
        return ElementalType.ELECTRIC;
      case TerrainType.MISTY:
        return ElementalType.FAIRY;
      case TerrainType.GRASSY:
        return ElementalType.GRASS;
      case TerrainType.PSYCHIC:
        return ElementalType.PSYCHIC;
      case TerrainType.NONE:
      default:
        return ElementalType.UNKNOWN;
    }
  }

  /**
   * Retrieves a type from the current biome
   * @param biomeType {@linkcode Biome}
   * @returns the {@linkcode ElementalType} corresponding to the biome
   */
  private getTypeForBiome(biomeType: Biome): ElementalType {
    switch (biomeType) {
      case Biome.TOWN:
      case Biome.PLAINS:
      case Biome.METROPOLIS:
        return ElementalType.NORMAL;
      case Biome.GRASS:
      case Biome.TALL_GRASS:
        return ElementalType.GRASS;
      case Biome.FOREST:
      case Biome.JUNGLE:
        return ElementalType.BUG;
      case Biome.SLUM:
      case Biome.SWAMP:
        return ElementalType.POISON;
      case Biome.SEA:
      case Biome.BEACH:
      case Biome.LAKE:
      case Biome.SEABED:
        return ElementalType.WATER;
      case Biome.MOUNTAIN:
        return ElementalType.FLYING;
      case Biome.BADLANDS:
        return ElementalType.GROUND;
      case Biome.CAVE:
      case Biome.DESERT:
        return ElementalType.ROCK;
      case Biome.ICE_CAVE:
      case Biome.SNOWY_FOREST:
        return ElementalType.ICE;
      case Biome.MEADOW:
      case Biome.FAIRY_CAVE:
      case Biome.ISLAND:
        return ElementalType.FAIRY;
      case Biome.POWER_PLANT:
        return ElementalType.ELECTRIC;
      case Biome.VOLCANO:
        return ElementalType.FIRE;
      case Biome.GRAVEYARD:
      case Biome.TEMPLE:
        return ElementalType.GHOST;
      case Biome.DOJO:
      case Biome.CONSTRUCTION_SITE:
        return ElementalType.FIGHTING;
      case Biome.FACTORY:
      case Biome.LABORATORY:
        return ElementalType.STEEL;
      case Biome.RUINS:
      case Biome.SPACE:
        return ElementalType.PSYCHIC;
      case Biome.WASTELAND:
      case Biome.END:
        return ElementalType.DRAGON;
      case Biome.ABYSS:
        return ElementalType.DARK;
      default:
        return ElementalType.UNKNOWN;
    }
  }
}
