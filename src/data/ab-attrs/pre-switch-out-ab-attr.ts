import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PreSwitchOutAbAttr extends AbAttr {
  constructor(showAbility: boolean = true) {
    super(showAbility, true);
  }

  /**
   * Applies an effect before the source switches out of the field
   * @param _pokemon The {@linkcode Pokemon} with this ability
   * @param _simulated If `true`, suppresses changes to game state
   * @returns `true` if effects from this attribute apply successfully
   */
  override apply(_pokemon: Pokemon, _simulated: boolean): boolean {
    return false;
  }
}
