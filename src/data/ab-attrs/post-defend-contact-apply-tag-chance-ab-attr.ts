import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type Move from "../move";
import { MoveFlags } from "../move";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendContactApplyTagChanceAbAttr extends PostDefendAbAttr {
  private chance: integer;
  private tagType: BattlerTagType;
  private turnCount: integer | undefined;

  constructor(chance: integer, tagType: BattlerTagType, turnCount?: integer) {
    super();

    this.tagType = tagType;
    this.chance = chance;
    this.turnCount = turnCount;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && pokemon.randSeedInt(100) < this.chance
      && !move.hitsSubstitute(attacker, pokemon)
    ) {
      if (simulated) {
        return attacker.canAddTag(this.tagType);
      } else {
        return attacker.addTag(this.tagType, this.turnCount, move.id, attacker.id);
      }
    }

    return false;
  }
}
