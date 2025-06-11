import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

/**
 * Base class for defining all {@linkcode Ability} Attributes post summon
 * @see {@linkcode applyPostSummon()}
 * @todo Most post-summon abilities should activate when the pokemon gains the ability (such as from Skill Swap)
 */
export abstract class PostSummonAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POST_SUMMON);
  }

  /**
   * Applies ability post summon (after switching in)
   * @param pokemon {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param args Set of unique arguments needed by this attribute
   * @returns true if application of the ability succeeds
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, ..._args: unknown[]): boolean {
    return false;
  }
}
