import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";

export abstract class PostBattleInitAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostBattleInitAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect at the start of battle
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   */
  public abstract override apply(pokemon: Pokemon, simulated: boolean): void;
}
