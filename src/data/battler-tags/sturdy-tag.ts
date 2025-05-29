import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Tag to implement behavior related to the enduring effect of
 * {@link https://bulbapedia.bulbagarden.net/wiki/Sturdy_(Ability) | Sturdy}.
 * This is added to Pokemon with the ability whenever they receive lethal attack damage from full HP.
 * @extends BattlerTag
 */
export class SturdyTag extends BattlerTag {
  constructor(sourceMoveId: MoveId) {
    super(BattlerTagType.STURDY, BattlerTagLapseType.TURN_END, 0, sourceMoveId);
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.CUSTOM) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:sturdyLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
      return false;
    }

    return super.lapse(pokemon, lapseType);
  }
}
