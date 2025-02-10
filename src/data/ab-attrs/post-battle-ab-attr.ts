import type { Pokemon } from "#app/field/pokemon";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export abstract class PostBattleAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POST_BATTLE);
  }

  /**
   * Applies an effect at the end of a battle.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param isVictory `true` if the result of the battle was a victory for the player
   * @returns `true` if effects from this ability applied successfully
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _isVictory: boolean): boolean {
    return false;
  }
}
