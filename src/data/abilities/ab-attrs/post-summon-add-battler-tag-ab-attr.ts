import type { Pokemon } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { PostSummonAbAttr } from "#app/data/abilities/ab-attrs/post-summon-ab-attr";

export class PostSummonAddBattlerTagAbAttr extends PostSummonAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;

  constructor(tagType: BattlerTagType, turnCount: number, showAbility?: boolean) {
    super(showAbility);

    this.tagType = tagType;
    this.turnCount = turnCount;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (simulated) {
      return pokemon.canAddTag(this.tagType);
    } else {
      return pokemon.addTag(this.tagType, this.turnCount);
    }
  }
}
