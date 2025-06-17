import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Tag implementing the type-changing effect of {@link https://bulbapedia.bulbagarden.net/wiki/Electrify_(move) | Electrify}.
 * While this tag is in effect, the afflicted Pokemon's moves are changed to Electric type.
 */
export class ElectrifiedTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.ELECTRIFIED, BattlerTagLapseType.TURN_END, 1, MoveId.ELECTRIFY);
  }

  override onAdd(pokemon: Pokemon): void {
    // "{pokemonNameWithAffix}'s moves have been electrified!"
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("battlerTags:electrifiedOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }
}
