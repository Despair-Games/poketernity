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
 * Damages the owner by 1/4 of its maximum HP at the end of each turn if it is asleep.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Nightmare_(move) | Nightmare (Bulbapedia)}
 */
export class NightmareTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.NIGHTMARE, BattlerTagLapseType.TURN_END, 1, MoveId.NIGHTMARE);
  }

  public override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:nightmareOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  public override onOverlap(pokemon: Pokemon): void {
    super.onOverlap(pokemon);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:nightmareOnOverlap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  public override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.CUSTOM && !super.lapse(pokemon, lapseType)) {
      return false;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:nightmareLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
    // TODO: Update animation type
    globalScene.phaseManager.createAndUnshiftPhase("CommonAnimPhase", CommonAnim.CURSE, pokemon.getBattlerIndex());

    const cancelled = new ValueHolder(false);
    applyAbAttrs("BlockNonDirectDamageAbAttr", { pokemon, simulated: false, cancelled });

    if (!cancelled.value) {
      pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / 4));
    }

    return true;
  }

  public override getDescriptor(): string {
    return i18next.t("battlerTags:nightmareDesc");
  }
}
