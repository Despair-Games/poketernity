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

  public override apply(_pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): void {
    if (!simulated) {
      attacker.addTag(this.tagType, this.turnCount, move.id, attacker.id);
    }
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    return (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && pokemon.randSeedInt(100) < this.chance
      && attacker.canAddTag(this.tagType)
    );
  }
}
