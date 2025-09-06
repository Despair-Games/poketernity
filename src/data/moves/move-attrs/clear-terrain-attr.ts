import { TerrainType } from "#enums/terrain-type";
import { TerrainChangeAttr } from "#moves/terrain-change-attr";

/**
 * Attribute to clear active terrain from the field.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Defog_(move) | Defog},
 * {@link https://bulbapedia.bulbagarden.net/wiki/Steel_Roller_(move) | Steel Roller},
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Ice_Spinner_(move) | Ice Spinner}.
 */
export class ClearTerrainAttr extends TerrainChangeAttr {
  constructor() {
    super(TerrainType.NONE);
  }

  /** Removes the condition from {@linkcode TerrainChangeAttr} */
  public override getCondition(): null {
    return null;
  }
}
