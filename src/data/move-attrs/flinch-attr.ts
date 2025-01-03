import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { NumberHolder } from "#app/utils";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { IgnoreMoveEffectsAbAttr } from "../ab-attrs/ignore-move-effect-ab-attr";
import { MoveEffectChanceMultiplierAbAttr } from "../ab-attrs/move-effect-chance-multiplier-ab-attr";
import { applyAbAttrs, applyPreDefendAbAttrs } from "../ability";
import type { Move } from "../move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

/**
 * Attribute adding a chance to flinch the target.
 * @extends AddBattlerTagAttr
 */
export class FlinchAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.FLINCHED, false);
  }

  /** Serene Grace and the Water + Fire Pledge combo effect do not stack for flinching */
  override getMoveChance(
    user: Pokemon,
    target: Pokemon,
    move: Move,
    selfEffect: boolean,
    showAbility?: boolean,
  ): number {
    const moveChance = new NumberHolder(this.effectChanceOverride ?? move.chance);

    applyAbAttrs(
      MoveEffectChanceMultiplierAbAttr,
      user,
      null,
      false,
      moveChance,
      move,
      target,
      selfEffect,
      showAbility,
    );

    if (moveChance.value <= move.chance) {
      const userSide = user.getArenaTagSide();
      globalScene.arena.applyTagsForSide(ArenaTagType.WATER_FIRE_PLEDGE, userSide, false, moveChance);
    }

    if (!selfEffect) {
      applyPreDefendAbAttrs(IgnoreMoveEffectsAbAttr, target, user, null, null, false, moveChance);
    }
    return moveChance.value;
  }
}
