import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag to allow the affected Pokemon to survive lethal attacks at 1 HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Endure_(move) | Endure}.
 * @extends BattlerTag
 */
export class EnduringTag extends BattlerTag {
  constructor(tagType: BattlerTagType, lapseType: BattlerTagLapseType, sourceMoveId: MoveId) {
    super(tagType, lapseType, 0, sourceMoveId);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:enduringOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    if (lapseType === BattlerTagLapseType.CUSTOM) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("battlerTags:enduringLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
      return true;
    }

    return super.lapse(pokemon, lapseType);
  }
}
