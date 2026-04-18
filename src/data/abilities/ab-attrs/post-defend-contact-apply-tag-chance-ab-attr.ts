import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";

export class PostDefendContactApplyTagChanceAbAttr extends PostDefendAbAttr {
  private readonly chance: number;
  private readonly tagType: BattlerTagType;
  private readonly turnCount?: number;

  constructor(chance: number, tagType: BattlerTagType, turnCount?: number) {
    super();

    this.tagType = tagType;
    this.chance = chance;
    this.turnCount = turnCount;
  }

  public override apply({ simulated, attacker, move }: PostDefendAbAttrParams): void {
    if (!simulated) {
      attacker.addTag(this.tagType, this.turnCount, move.id, attacker.id);
    }
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && pokemon.randSeedInt(100) < this.chance
      && attacker.canAddTag(this.tagType)
    );
  }
}
