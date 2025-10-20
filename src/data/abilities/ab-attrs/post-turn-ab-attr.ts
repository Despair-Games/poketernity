import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

export abstract class PostTurnAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.POST_TURN);
  }

  /**
   * Applies an effect at the end of a turn.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean): void;
}
