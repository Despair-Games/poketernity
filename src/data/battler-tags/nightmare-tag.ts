import type { BlockNonDirectDamageAbAttr } from "#app/data/abilities/ab-attrs/block-non-direct-damage-ab-attr";
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
      globalScene.phaseManager.unshiftPhase(
        new CommonAnimPhase(pokemon.getBattlerIndex(), undefined, CommonAnim.CURSE),
      ); // TODO: Update animation type

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
