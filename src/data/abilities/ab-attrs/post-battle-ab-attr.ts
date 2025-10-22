import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

export abstract class PostBattleAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.POST_BATTLE);
  }

  /**
   * Applies an effect at the end of a battle.
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   * @param isVictory - `true` if the result of the battle was a victory for the player
   */
  public abstract override apply(pokemon: Pokemon, simulated: boolean, isVictory: boolean): void;
}
