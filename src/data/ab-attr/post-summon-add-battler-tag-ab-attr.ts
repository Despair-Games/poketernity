import type Pokemon from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { PostSummonAbAttr } from "./post-summon-ab-attr";
export class PostSummonAddBattlerTagAbAttr extends PostSummonAbAttr {
  private tagType: BattlerTagType;
  private turnCount: integer;

  constructor(tagType: BattlerTagType, turnCount: integer, showAbility?: boolean) {
    super(showAbility);

    this.tagType = tagType;
    this.turnCount = turnCount;
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (simulated) {
      return pokemon.canAddTag(this.tagType);
    } else {
      return pokemon.addTag(this.tagType, this.turnCount);
    }
  }
}
