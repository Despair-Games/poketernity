import { PostItemLostAbAttr } from "#abilities/post-item-lost-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";

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

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!pokemon.getTag(this.tagType)) {
      if (!simulated) {
        pokemon.addTag(this.tagType);
      }
      return true;
    }
    return false;
  }
}
