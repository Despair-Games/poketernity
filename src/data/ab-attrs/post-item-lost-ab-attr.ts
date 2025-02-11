import type { Pokemon } from "#app/field/pokemon";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

/**
 * Triggers after the Pokemon loses or consumes an item
 * @extends AbAttr
 */
export abstract class PostItemLostAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POST_ITEM_LOST);
  }

  /**
   * Applies an effect when the source Pokemon loses or consumes an item
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @returns `true` if effects from this ability applied successfully.
   */
  override apply(_pokemon: Pokemon, _simulated: boolean): boolean {
    return false;
  }
}
