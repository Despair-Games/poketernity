import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

export class PostDefendContactApplyTagChanceAbAttr extends PostDefendAbAttr {
  private readonly chance: number;
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number | undefined;

  constructor(chance: number, tagType: BattlerTagType, turnCount?: number) {
    super();

    this.tagType = tagType;
    this.chance = chance;
    this.turnCount = turnCount;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon) && pokemon.randSeedInt(100) < this.chance) {
      if (simulated) {
        return attacker.canAddTag(this.tagType);
      }
      return attacker.addTag(this.tagType, this.turnCount, move.id, attacker.id);
    }

    return false;
  }
}
