import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";

/**
 * Tag to indicate the owner can steal a beneficial self-status move's effects
 * with {@link https://bulbapedia.bulbagarden.net/wiki/Snatch_(move) | Snatch}.
 * @extends BattlerTag
 */
export class SnatchingTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.SNATCHING, BattlerTagLapseType.TURN_END, 1);
  }

  override onAdd(pokemon: Pokemon) {
    // "{pokemonNameWithAffix" waits for a target to make a move!"
    globalScene.queueMessage(
      i18next.t("battlerTags:snatchOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override apply(pokemon: Pokemon, simulated: boolean, target: Pokemon): boolean {
    if (!simulated) {
      // "{sourceNameWithAffix} snatched {targetNameWithAffix}'s move!"
      globalScene.queueMessage(
        i18next.t("battlerTags:snatchOnApply", {
          sourceNameWithAffix: getPokemonNameWithAffix(pokemon),
          targetNameWithAffix: getPokemonNameWithAffix(target),
        }),
      );
    }
    return true;
  }
}
