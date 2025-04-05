import { BiomeId } from "#enums/biome-id";
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
      typeChange = this.getTypeForBiome(globalScene.arena.biomeId);
    }

    user.summonData.types = [typeChange];
    user.updateInfo();

    globalScene.phaseManager.queueMessagePhase(
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
   * @param biomeId {@linkcode BiomeId}
   * @returns the {@linkcode ElementalType} corresponding to the biome
   */
  private getTypeForBiome(biomeId: BiomeId): ElementalType {
    switch (biomeId) {
      case BiomeId.TOWN:
      case BiomeId.PLAINS:
      case BiomeId.METROPOLIS:
        return ElementalType.NORMAL;
      case BiomeId.GRASS:
      case BiomeId.TALL_GRASS:
        return ElementalType.GRASS;
      case BiomeId.FOREST:
      case BiomeId.JUNGLE:
        return ElementalType.BUG;
      case BiomeId.SLUM:
      case BiomeId.SWAMP:
        return ElementalType.POISON;
      case BiomeId.SEA:
      case BiomeId.BEACH:
      case BiomeId.LAKE:
      case BiomeId.SEABED:
        return ElementalType.WATER;
      case BiomeId.MOUNTAIN:
        return ElementalType.FLYING;
      case BiomeId.BADLANDS:
        return ElementalType.GROUND;
      case BiomeId.CAVE:
      case BiomeId.DESERT:
        return ElementalType.ROCK;
      case BiomeId.ICE_CAVE:
      case BiomeId.SNOWY_FOREST:
        return ElementalType.ICE;
      case BiomeId.MEADOW:
      case BiomeId.FAIRY_CAVE:
      case BiomeId.ISLAND:
        return ElementalType.FAIRY;
      case BiomeId.POWER_PLANT:
        return ElementalType.ELECTRIC;
      case BiomeId.VOLCANO:
        return ElementalType.FIRE;
      case BiomeId.GRAVEYARD:
      case BiomeId.TEMPLE:
        return ElementalType.GHOST;
      case BiomeId.DOJO:
      case BiomeId.CONSTRUCTION_SITE:
        return ElementalType.FIGHTING;
      case BiomeId.FACTORY:
      case BiomeId.LABORATORY:
        return ElementalType.STEEL;
      case BiomeId.RUINS:
      case BiomeId.SPACE:
        return ElementalType.PSYCHIC;
      case BiomeId.WASTELAND:
      case BiomeId.END:
        return ElementalType.DRAGON;
      case BiomeId.ABYSS:
        return ElementalType.DARK;
      default:
        return ElementalType.UNKNOWN;
    }
  }
}
