import { AbAttr } from "#abilities/ab-attr";
import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";

export abstract class PostTerrainChangeAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostTerrainChangeAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect after the terrain on the field changes
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param terrain The {@linkcode TerrainType | terrain} being set
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean, _terrain: TerrainType): void;
}
