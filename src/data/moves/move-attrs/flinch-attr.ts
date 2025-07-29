import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { IgnoreMoveEffectsAbAttr } from "#abilities/ignore-move-effects-ab-attr";
import type { MoveEffectChanceMultiplierAbAttr } from "#abilities/move-effect-chance-multiplier-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
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
  override getMoveChance(user: Pokemon, target: Pokemon, move: Move, showAbility: boolean = false): number {
    const moveChance = new NumberHolder(this.effectChanceOverride ?? move.chance);

    applyAbAttrs<MoveEffectChanceMultiplierAbAttr>(
      AbAttrFlag.MOVE_EFFECT_CHANCE_MULTIPLIER,
      user,
      false,
      moveChance,
      move,
      showAbility,
    );

    if (moveChance.value <= move.chance) {
      const userSide = user.getArenaTagSide();
      globalScene.arena.applyTags(ArenaTagType.WATER_FIRE_PLEDGE, userSide, false, moveChance);
    }

    applyAbAttrs<IgnoreMoveEffectsAbAttr>(AbAttrFlag.IGNORE_MOVE_EFFECTS, target, false, user, move, moveChance);

    return moveChance.value;
  }
}
