import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";

export abstract class PostVictoryAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostVictoryAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect after the source KOs another Pokemon
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean): void;
}
