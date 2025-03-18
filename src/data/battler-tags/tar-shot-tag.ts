import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";

/**
 * Tag representing the continuous effect of {@link http://bulbapedia.bulbagarden.net/wiki/Tar_Shot_(move) | Tar Shot}.
 * that doubles the type effectiveness of Fire-type moves.
 * @extends BattlerTag
 */
export class TarShotTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.TAR_SHOT, BattlerTagLapseType.CUSTOM, 0);
  }

  /**
   * If the Pokemon is terastallized, the tag cannot be added.
   * @param pokemon the {@linkcode Pokemon} to which the tag is added
   * @returns whether the tag is applied
   */
  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.isTerastallized();
  }

  override onAdd(pokemon: Pokemon): void {
    globalScene.queueMessage(
      i18next.t("battlerTags:tarShotOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }
}
