import { PostItemLostAbAttr } from "#abilities/post-item-lost-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Applies a Battler Tag to the Pokemon after it loses or consumes an item.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Unburden_(Ability)}
 */
export class PostItemLostApplyBattlerTagAbAttr extends PostItemLostAbAttr {
  private readonly tagType: BattlerTagType;

  constructor(tagType: BattlerTagType) {
    super();

    this.tagType = tagType;
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      pokemon.addTag(this.tagType);
    }
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.canAddTag(this.tagType);
  }
}
