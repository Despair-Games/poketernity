import type { Move } from "#app/data/moves/move";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

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

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon) && pokemon.randSeedInt(100) < this.chance) {
      if (simulated) {
        return attacker.canAddTag(this.tagType);
      } else {
        return attacker.addTag(this.tagType, this.turnCount, move.id, attacker.id);
      }
    }

    return false;
  }
}
