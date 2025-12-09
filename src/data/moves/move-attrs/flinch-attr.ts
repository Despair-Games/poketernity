import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import type { WaterFirePledgeTag } from "#arena-tags/water-fire-pledge-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import { NumberHolder } from "#utils/common-utils";

/**
 * Attribute adding a chance to flinch the target.
 */
export class FlinchAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.FLINCHED, false);
  }

  /** Serene Grace and the Water + Fire Pledge combo effect do not stack for flinching */
  override getMoveChance(user: Pokemon, target: Pokemon, move: Move): number {
    const moveChance = new NumberHolder(this.effectChanceOverride ?? move.chance);

    applyAbAttrs("MoveEffectChanceMultiplierAbAttr", user, false, moveChance, move);

    if (moveChance.value <= move.chance) {
      const userSide = user.getArenaTagSide();
      globalScene.arena.applyTags<WaterFirePledgeTag>(ArenaTagType.WATER_FIRE_PLEDGE, userSide, false, moveChance);
    }

    applyAbAttrs("IgnoreMoveEffectsAbAttr", target, false, user, move, moveChance);

    return moveChance.value;
  }
}
