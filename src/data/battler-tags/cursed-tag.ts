import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue, ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Tag representing the effect of Ghost-type {@link https://bulbapedia.bulbagarden.net/wiki/Curse_(move) | Curse},
 * which damages a Pokemon for 1/4th of its max HP each turn
 */
export class CursedTag extends BattlerTag {
  constructor(sourceId: number) {
    super(BattlerTagType.CURSED, BattlerTagLapseType.TURN_END, 1, MoveId.CURSE, sourceId, true);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.createAndUnshiftPhase("CommonAnimPhase", CommonAnim.CURSE, pokemon.getBattlerIndex());

      const cancelled = new ValueHolder(false);
      applyAbAttrs("BlockNonDirectDamageAbAttr", pokemon, false, cancelled);

      if (!cancelled.value) {
        pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 4));
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("battlerTags:cursedLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
        );
      }
    }

    return ret;
  }
}
