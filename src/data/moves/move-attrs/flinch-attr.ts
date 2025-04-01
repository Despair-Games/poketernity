import type { IgnoreMoveEffectsAbAttr } from "#app/data/abilities/ab-attrs/ignore-move-effects-ab-attr";
import type { MoveEffectChanceMultiplierAbAttr } from "#app/data/abilities/ab-attrs/move-effect-chance-multiplier-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Move } from "#app/data/moves/move";
import { AddBattlerTagAttr } from "#app/data/moves/move-attrs/add-battler-tag-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";

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
    showAbility: boolean = false,
  ): number {
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
      globalScene.arena.applyTagsForSide(ArenaTagType.WATER_FIRE_PLEDGE, userSide, false, moveChance);
    }

    if (!selfEffect) {
      applyAbAttrs<IgnoreMoveEffectsAbAttr>(AbAttrFlag.IGNORE_MOVE_EFFECTS, target, false, user, move, moveChance);
    }
    return moveChance.value;
  }
}
