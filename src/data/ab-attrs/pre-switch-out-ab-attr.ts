import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export abstract class PreSwitchOutAbAttr extends AbAttr {
  constructor(showAbility: boolean = true) {
    super(showAbility, true);
  }

  /**
   * Applies an effect before the source switches out of the field
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @returns `true` if effects from this attribute apply successfully
   */
  override apply(_pokemon: Pokemon, _simulated: boolean): boolean {
    return false;
  }
}
