import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

export class PostSummonAddBattlerTagAbAttr extends PostSummonAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;

  constructor(tagType: BattlerTagType, turnCount: number, showAbility: boolean = true) {
    super(showAbility);

    this.tagType = tagType;
    this.turnCount = turnCount;
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      pokemon.addTag(this.tagType, this.turnCount);
    }
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.canAddTag(this.tagType);
  }
}
