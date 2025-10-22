import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";

export class PostSummonAddBattlerTagAbAttr extends PostSummonAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;

  constructor(tagType: BattlerTagType, turnCount: number, showAbility: boolean = true) {
    super(showAbility);

    this.tagType = tagType;
    this.turnCount = turnCount;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      pokemon.addTag(this.tagType, this.turnCount);
    }
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return pokemon.canAddTag(this.tagType);
  }
}
