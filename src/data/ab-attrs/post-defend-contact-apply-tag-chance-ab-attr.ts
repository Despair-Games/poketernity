import type { Move } from "#app/data/move";
import { MoveFlags } from "../../enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendContactApplyTagChanceAbAttr extends PostDefendAbAttr {
  private chance: number;
  private tagType: BattlerTagType;
  private turnCount: number | undefined;

  constructor(chance: number, tagType: BattlerTagType, turnCount?: number) {
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
