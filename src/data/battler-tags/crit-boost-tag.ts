import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag to denote a nonstackable boost to crit rate. Granted by:
 * Focus Energy (+2), Dragon Cheer (+2 if dragon, +1 otherwise),
 * and Lansat Berry (+2)
 * @extends BattlerTag
 */
export class CritBoostTag extends BattlerTag {
  constructor(tagType: BattlerTagType, sourceMoveId: MoveId) {
    super(tagType, BattlerTagLapseType.CUSTOM, 1, sourceMoveId, undefined, true);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.queueMessage(
      i18next.t("battlerTags:critBoostOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    return lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.queueMessage(
      i18next.t("battlerTags:critBoostOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }
}
