import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Tag to force the affected Pokemon to move last in the turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Quash_(move) | Quash}.
 * @extends BattlerTag
 */
export class QuashedTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.QUASHED, BattlerTagLapseType.TURN_END, 1);
  }

  override onAdd(pokemon: Pokemon) {
    // "{pokemonNameWithAffix}'s move was postponed!"
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:quashOnAdd", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      }),
    );
  }
}
