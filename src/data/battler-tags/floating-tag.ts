import { TypeImmuneTag } from "#app/data/battler-tags/type-immune-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag that lifts the affected Pokemon into the air and provides immunity to Ground type moves.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Magnet_Rise_(move) | Magnet Rise}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Telekinesis_(move) | Telekinesis}
 * @extends TypeImmuneTag
 */
export class FloatingTag extends TypeImmuneTag {
  constructor(tagType: BattlerTagType, sourceMoveId: MoveId, turnCount: number) {
    super(tagType, sourceMoveId, ElementalType.GROUND, turnCount);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    if (this.sourceMoveId === MoveId.MAGNET_RISE) {
      globalScene.queueMessage(
        i18next.t("battlerTags:magnetRisenOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
    }
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);
    if (this.sourceMoveId === MoveId.MAGNET_RISE) {
      globalScene.queueMessage(
        i18next.t("battlerTags:magnetRisenOnRemove", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      );
    }
  }
}
