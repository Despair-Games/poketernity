import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";
import { Stat } from "#enums/stat";
import i18next from "i18next";

/**
 * Tag that swaps the user's base ATK stat with its base DEF stat.
 * @extends BattlerTag
 */
export class PowerTrickTag extends BattlerTag {
  constructor(sourceMoveId: MoveId, sourceId: number) {
    super(BattlerTagType.POWER_TRICK, BattlerTagLapseType.CUSTOM, 0, sourceMoveId, sourceId, true);
  }

  override onAdd(pokemon: Pokemon): void {
    this.swapStat(pokemon);
    globalScene.queueMessage(
      i18next.t("battlerTags:powerTrickActive", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override onRemove(pokemon: Pokemon): void {
    this.swapStat(pokemon);
    globalScene.queueMessage(
      i18next.t("battlerTags:powerTrickActive", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  /**
   * Removes the Power Trick tag and reverts any stat changes if the tag is already applied.
   * @param pokemon The {@linkcode Pokemon} that already has the Power Trick tag.
   */
  override onOverlap(pokemon: Pokemon): void {
    pokemon.removeTag(this.tagType);
  }

  /**
   * Swaps the user's base ATK stat with its base DEF stat.
   * @param pokemon The {@linkcode Pokemon} whose stats will be swapped.
   */
  swapStat(pokemon: Pokemon): void {
    const temp = pokemon.getStat(Stat.ATK, false);
    pokemon.setStat(Stat.ATK, pokemon.getStat(Stat.DEF, false), false);
    pokemon.setStat(Stat.DEF, temp, false);
  }
}
