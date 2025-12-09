import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";

export abstract class PostBattleAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostBattleAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect at the end of a battle.
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   * @param isVictory - `true` if the result of the battle was a victory for the player
   */
  public abstract override apply(pokemon: Pokemon, simulated: boolean, isVictory: boolean): void;
}
