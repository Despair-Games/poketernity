import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Tag indicating the owner is afflicted by the secondary effect of
 * {@link https://bulbapedia.bulbagarden.net/wiki/Salt_Cure_(move) | Salt Cure}.
 * Deals 1/8 of the owner's maximum HP as damage at the end of each turn, or
 * 1/4 if the owner is Water- or Steel-type.
 */
export class SaltCuredTag extends BattlerTag {
  private sourceIndex: number;

  constructor(sourceId: number) {
    super(BattlerTagType.SALT_CURED, BattlerTagLapseType.TURN_END, 1, MoveId.SALT_CURE, sourceId);
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

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:saltCuredOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
    this.sourceIndex = globalScene.getPokemonById(this.sourceId!)!.getBattlerIndex(); // TODO: are those bangs correct?
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "CommonAnimPhase",
        CommonAnim.SALT_CURE,
        pokemon.getBattlerIndex(),
      );

      const cancelled = new BooleanHolder(false);
      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);

      if (!cancelled.value) {
        const pokemonSteelOrWater = pokemon.isOfType(ElementalType.STEEL) || pokemon.isOfType(ElementalType.WATER);
        pokemon.damageAndUpdate(toDmgValue(pokemonSteelOrWater ? pokemon.getMaxHp() / 4 : pokemon.getMaxHp() / 8));

        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("battlerTags:saltCuredLapse", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            moveName: this.getMoveName(),
          }),
        );
      }
    }

    return ret;
  }
}
