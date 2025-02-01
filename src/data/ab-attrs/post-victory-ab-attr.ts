import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export abstract class PostVictoryAbAttr extends AbAttr {
  /**
   * Applies an effect after the source KOs another Pokemon
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @returns `true` if effects successfully applied
   */
  override apply(_pokemon: Pokemon, _simulated: boolean): boolean {
    return false;
  }
}
