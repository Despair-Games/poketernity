import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export abstract class PostFaintAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POST_FAINT);
  }

  /**
   * Applies an effect after the source Pokemon faints
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param attacker The {@linkcode Pokemon} that caused the source to faint
   * @param move The {@linkcode Move} that caused the source to faint
   * @returns `true` if effects from this attribute successfully apply
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, _attacker?: Pokemon, _move?: Move): boolean {
    return false;
  }
}
