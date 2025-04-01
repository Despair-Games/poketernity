import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag representing the effect of {@link https://bulbapedia.bulbagarden.net/wiki/Helping_Hand_(move) | Helping Hand}.
 * Boosts the power of the owner's attacks by 50% for the rest of the turn
 * @extends BattlerTag
 */
export class HelpingHandTag extends BattlerTag {
  constructor(sourceId: number) {
    super(BattlerTagType.HELPING_HAND, BattlerTagLapseType.TURN_END, 1, MoveId.HELPING_HAND, sourceId);
  }

  override onAdd(pokemon: Pokemon): void {
    globalScene.queueMessage(
      i18next.t("battlerTags:helpingHandOnAdd", {
        pokemonNameWithAffix: getPokemonNameWithAffix(globalScene.getPokemonById(this.sourceId!) ?? undefined), // TODO: is that bang correct?
        pokemonName: getPokemonNameWithAffix(pokemon),
      }),
    );
  }
}
