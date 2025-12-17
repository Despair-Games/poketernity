import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTag } from "#battler-tags/battler-tag";
import { TrappedTag } from "#battler-tags/trapped-tag";
import type { DAMAGING_TRAPPED_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { TRAPPED_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { CommonAnim } from "#enums/common-anim";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Tag representing all effects that trap and damage a Pokemon over the course of multiple turns
 *
 * @privateRemarks
 * Tags that use or subclass this should be added to {@linkcode DAMAGING_TRAPPED_BATTLER_TAG_TYPES}
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
    return !pokemon.hasTag(...TRAPPED_BATTLER_TAG_TYPES, BattlerTagType.SUBSTITUTE);
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("battlerTags:damagingTrapLapse", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          moveName: this.getMoveName(),
        }),
      );
      globalScene.phaseManager.createAndUnshiftPhase("CommonAnimPhase", this.commonAnim, pokemon.getBattlerIndex());

      const cancelled = new BooleanHolder(false);
      applyAbAttrs("BlockNonDirectDamageAbAttr", pokemon, false, cancelled);

      if (!cancelled.value) {
        pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 8));
      }
    }

    return ret;
  }
}
