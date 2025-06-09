// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CRIT_BOOST_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import type { ElementalType } from "#enums/elemental-type";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Tag to denote a nonstackable boost to crit rate. Granted by:
 * - Focus Energy (`+2`)
 * - Dragon Cheer (`+2` if {@linkcode ElementalType.DRAGON | Dragon type}, `+1` otherwise)
 * - Lansat Berry (`+2`)
 *
 * @privateRemarks
 * Tags that use or subclass this should be added to {@linkcode CRIT_BOOST_BATTLER_TAG_TYPES}
 */
export class CritBoostTag extends BattlerTag {
  constructor(tagType: BattlerTagType, sourceMoveId: MoveId) {
    super(tagType, BattlerTagLapseType.CUSTOM, 1, sourceMoveId, undefined, true);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:critBoostOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    return lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:critBoostOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }
}
