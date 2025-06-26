// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { TYPE_IMMUNE_TAG_TYPES } from "#constants/battler-tag-constants";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { TypeImmuneTag } from "#battler-tags/type-immune-tag";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Tag that lifts the affected Pokemon into the air and provides immunity to Ground type moves.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Magnet_Rise_(move) | Magnet Rise}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Telekinesis_(move) | Telekinesis}
 *
 * @privateRemarks
 * Tags that use or subclass this should be added to {@linkcode TYPE_IMMUNE_TAG_TYPES}
 */
export class FloatingTag extends TypeImmuneTag {
  constructor(tagType: BattlerTagType, sourceMoveId: MoveId, turnCount: number) {
    super(tagType, sourceMoveId, ElementalType.GROUND, turnCount);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    if (this.sourceMoveId === MoveId.MAGNET_RISE) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("battlerTags:magnetRisenOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
    }
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);
    if (this.sourceMoveId === MoveId.MAGNET_RISE) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("battlerTags:magnetRisenOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
    }
  }
}
