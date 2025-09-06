import { TerrainType } from "#enums/terrain-type";
import { ChangeTerrainAttr } from "#moves/change-terrain-attr";

/**
 * Attribute to clear active terrain from the field.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Defog_(move) | Defog},
 * {@link https://bulbapedia.bulbagarden.net/wiki/Steel_Roller_(move) | Steel Roller},
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Ice_Spinner_(move) | Ice Spinner}.
 */
export class ClearTerrainAttr extends ChangeTerrainAttr {
  constructor() {
    super(TerrainType.NONE);
  }

  /** Removes the condition from {@linkcode ChangeTerrainAttr} */
  public override getCondition(): null {
    return null;
  }
}
