import { TerrainType } from "#enums/terrain-type";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { getTypeForBiome } from "#app/data/biome-utils";

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
      typeChange = getTypeForBiome(globalScene.arena.biomeId);
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
}
