import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";

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
