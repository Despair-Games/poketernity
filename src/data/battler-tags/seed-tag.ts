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
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag representing the {@link https://bulbapedia.bulbagarden.net/wiki/Seeding | Seeding} status condition.
 * Steals 1/8 of the owner's maximum HP at the end of each turn, giving it
 * to the Pokemon in the position of the original user.
 * @extends BattlerTag
 */
export class SeedTag extends BattlerTag {
  private sourceIndex: number;

  constructor(sourceId: number) {
    super(BattlerTagType.SEEDED, BattlerTagLapseType.TURN_END, 1, MoveId.LEECH_SEED, sourceId, true);
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.sourceIndex = source.sourceIndex;
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.isOfType(ElementalType.GRASS);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.queueMessage(
      i18next.t("battlerTags:seededOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
    this.sourceIndex = globalScene.getPokemonById(this.sourceId!)!.getBattlerIndex(); // TODO: are those bangs correct?
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (ret) {
      const source = pokemon.getOpponents().find((o) => o.getBattlerIndex() === this.sourceIndex);
      if (source) {
        const cancelled = new BooleanHolder(false);
        applyAbAttrs(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);

        if (!cancelled.value) {
          globalScene.unshiftPhase(
            new CommonAnimPhase(source.getBattlerIndex(), pokemon.getBattlerIndex(), CommonAnim.LEECH_SEED),
          );

          const damage = pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 8), { ignoreDynamaxReduction: true });
          const reverseDrain = pokemon.hasAbilityWithAttr(AbAttrFlag.REVERSE_DRAIN, false);

          globalScene.queuePokemonHeal(true, source.getBattlerIndex(), !reverseDrain ? damage : damage * -1, {
            message: !reverseDrain
              ? i18next.t("battlerTags:seededLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) })
              : i18next.t("battlerTags:seededLapseShed", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
            showFullHpMessage: false,
            skipAnim: true,
          });
        }
      }
    }

    return ret;
  }

  override getDescriptor(): string {
    return i18next.t("battlerTags:seedDesc");
  }
}
