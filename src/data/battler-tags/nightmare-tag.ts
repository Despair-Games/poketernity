import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { CommonAnimPhase } from "#phases/common-anim-phase";
import { BooleanHolder, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Tag representing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Nightmare_(move) | Nightmare}.
 * Damages the owner by 1/4 of its maximum HP at the end of each turn if it is asleep.
 * @extends BattlerTag
 */
export class NightmareTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.NIGHTMARE, BattlerTagLapseType.TURN_END, 1, MoveId.NIGHTMARE);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:nightmareOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override onOverlap(pokemon: Pokemon): void {
    super.onOverlap(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:nightmareOnOverlap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:nightmareLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
      // TODO: Update animation type
      globalScene.phaseManager.unshiftPhase(new CommonAnimPhase(CommonAnim.CURSE, pokemon.getBattlerIndex()));

      const cancelled = new BooleanHolder(false);
      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);

      if (!cancelled.value) {
        pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 4));
      }
    }

    return ret;
  }

  override getDescriptor(): string {
    return i18next.t("battlerTags:nightmareDesc");
  }
}
