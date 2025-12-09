import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";

export abstract class PostTurnAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostTurnAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect at the end of a turn.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean): void;
}
