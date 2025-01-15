import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Triggers after the Pokemon loses or consumes an item
 * @extends AbAttr
 */
export class PostItemLostAbAttr extends AbAttr {
  /**
   * Applies an effect when the source Pokemon loses or consumes an item
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @returns `true` if effects from this ability applied successfully.
   */
  override apply(_pokemon: Pokemon, _simulated: boolean): boolean {
    return false;
  }
}
