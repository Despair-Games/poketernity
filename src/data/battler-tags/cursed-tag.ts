import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

export class CursedTag extends BattlerTag {
  private sourceIndex: number;

  constructor(sourceId: number) {
    super(BattlerTagType.CURSED, BattlerTagLapseType.TURN_END, 1, MoveId.CURSE, sourceId, true);
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.sourceIndex = source.sourceIndex;
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);
    this.sourceIndex = globalScene.getPokemonById(this.sourceId!)!.getBattlerIndex(); // TODO: are those bangs correct?
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.unshiftPhase(
        new CommonAnimPhase(pokemon.getBattlerIndex(), pokemon.getBattlerIndex(), CommonAnim.SALT_CURE),
      );

      const cancelled = new BooleanHolder(false);
      applyAbAttrs(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);

      if (!cancelled.value) {
        pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 4));
        globalScene.queueMessage(
          i18next.t("battlerTags:cursedLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
        );
      }
    }

    return ret;
  }
}
