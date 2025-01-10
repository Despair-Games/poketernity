import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Triggers after the Pokemon takes any damage
 * @extends AbAttr
 */
export class PostDamageAbAttr extends AbAttr {
  /**
   * Applies an effect after the Pokemon takes damage
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param damage The last instance of damage dealt to the Pokemon
   * @param source The {@linkcode Pokemon} who dealt damage to the ability owner
   * @returns `true` if effects successfully apply
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _damage: number, _source?: Pokemon): boolean {
    return false;
  }
}
