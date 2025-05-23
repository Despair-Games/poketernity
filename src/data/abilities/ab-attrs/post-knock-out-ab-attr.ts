import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

export abstract class PostKnockOutAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POST_KNOCK_OUT);
  }

  /**
   * Applies an effect after a Pokemon other than the source faints
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param knockedOutPokemon The {@linkcode Pokemon} that fainted
   * @returns `true` if effects successfully applied
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, _knockedOutPokemon: Pokemon): boolean {
    return false;
  }
}
