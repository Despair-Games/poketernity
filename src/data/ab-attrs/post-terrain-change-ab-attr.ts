import type { Pokemon } from "#app/field/pokemon";
import type { TerrainType } from "#enums/terrain-type";
import { AbAttr } from "./ab-attr";

export class PostTerrainChangeAbAttr extends AbAttr {
  /**
   * Applies an effect after the terrain on the field changes
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @param _terrain The {@linkcode TerrainType | terrain} being set
   * @param _args
   * @returns
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _terrain: TerrainType): boolean {
    return false;
  }
}
