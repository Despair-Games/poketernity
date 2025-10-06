import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

export abstract class PostBattleInitAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.POST_BATTLE_INIT);
  }

  /**
   * Applies an effect at the start of battle
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   */
  public abstract override apply(pokemon: Pokemon, simulated: boolean): void;
}
