import type { Pokemon } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { PostItemLostAbAttr } from "./post-item-lost-ab-attr";

/**
 * Applies a Battler Tag to the Pokemon after it loses or consumes item
 * Used by Unburden
 * @extends PostItemLostAbAttr
 */
export class PostItemLostApplyBattlerTagAbAttr extends PostItemLostAbAttr {
  private readonly tagType: BattlerTagType;
  constructor(tagType: BattlerTagType) {
    super(true);
    this.tagType = tagType;
  }
  /**
   * @param pokemon {@linkcode Pokemon} with this ability
   * @returns `true` if BattlerTag was applied
   */
  override applyPostItemLost(pokemon: Pokemon, simulated: boolean, _args: any[]): boolean {
    if (!pokemon.getTag(this.tagType)) {
      if (!simulated) {
        pokemon.addTag(this.tagType);
      }
      return true;
    }
    return false;
  }
}
