import { PostItemLostAbAttr } from "#abilities/post-item-lost-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";

/**
 * Applies a Battler Tag to the Pokemon after it loses or consumes an item.
 *
 * Used by Unburden
 */
export class PostItemLostApplyBattlerTagAbAttr extends PostItemLostAbAttr {
  private readonly tagType: BattlerTagType;
  constructor(tagType: BattlerTagType) {
    super();
    this.tagType = tagType;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      pokemon.addTag(this.tagType);
    }
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return pokemon.canAddTag(this.tagType);
  }
}
