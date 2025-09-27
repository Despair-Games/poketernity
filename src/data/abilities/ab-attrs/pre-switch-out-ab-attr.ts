import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

export abstract class PreSwitchOutAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.PRE_SWITCH_OUT);
  }

  /**
   * Applies an effect before the source switches out of the field
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   */
  public abstract override apply(pokemon: Pokemon, simulated: boolean): void;
}
