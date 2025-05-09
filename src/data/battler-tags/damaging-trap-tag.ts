import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { TRAPPED_BATTLER_TAG_TYPES } from "#app/constants/battler-tag-constants";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import type { BattlerTag } from "#battler-tags/battler-tag";
import { TrappedTag } from "#battler-tags/trapped-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { CommonAnim } from "#enums/common-anim";
import type { MoveId } from "#enums/move-id";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Tag representing all effects that trap and damage a Pokemon over the course of multiple turns
 * @extends TrappedTag
 */
export abstract class DamagingTrapTag extends TrappedTag {
  private commonAnim: CommonAnim;

  constructor(
    tagType: BattlerTagType,
    commonAnim: CommonAnim,
    turnCount: number,
    sourceMoveId: MoveId,
    sourceId: number,
  ) {
    super(tagType, BattlerTagLapseType.TURN_END, turnCount, sourceMoveId, sourceId);

    this.commonAnim = commonAnim;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.commonAnim = source.commonAnim as CommonAnim;
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.getTag(...TRAPPED_BATTLER_TAG_TYPES) && !pokemon.getTag(BattlerTagType.SUBSTITUTE);
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:damagingTrapLapse", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          moveName: this.getMoveName(),
        }),
      );
      globalScene.phaseManager.unshiftPhase(new CommonAnimPhase(this.commonAnim, pokemon.getBattlerIndex()));

      const cancelled = new BooleanHolder(false);
      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);

      if (!cancelled.value) {
        pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 8));
      }
    }

    return ret;
  }
}
