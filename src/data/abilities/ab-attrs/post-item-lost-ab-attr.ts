import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

/**
 * Triggers after the Pokemon loses or consumes an item
 */
export abstract class PostItemLostAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.POST_ITEM_LOST);
  }

  /**
   * Applies an effect when the source Pokemon loses or consumes an item
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @returns `true` if effects from this ability applied successfully.
   */
  public abstract override apply(pokemon: Pokemon, simulated: boolean): void;
}
