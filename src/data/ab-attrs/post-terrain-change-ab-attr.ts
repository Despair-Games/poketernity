import type { Pokemon } from "#app/field/pokemon";
import type { TerrainType } from "#enums/terrain-type";
import { AbAttr } from "./ab-attr";

export class PostTerrainChangeAbAttr extends AbAttr {
  /**
   * Applies an effect after the terrain on the field changes
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param terrain The {@linkcode TerrainType | terrain} being set
   * @returns `true` if effects successfully applied
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _terrain: TerrainType): boolean {
    return false;
  }
}
