import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

export abstract class PostVictoryAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.POST_VICTORY);
  }

  /**
   * Applies an effect after the source KOs another Pokemon
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean): void;
}
