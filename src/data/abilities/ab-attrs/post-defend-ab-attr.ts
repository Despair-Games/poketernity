import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export abstract class PostDefendAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POST_DEFEND);
  }

  /**
   * Applies an effect after being affected by another Pokemon's move.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param attacker The {@linkcode Pokemon} using the move
   * @param move The {@linkcode Move} being used
   * @returns `true` if effects successfully apply
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _attacker: Pokemon, _move: Move): boolean {
    return false;
  }
}
