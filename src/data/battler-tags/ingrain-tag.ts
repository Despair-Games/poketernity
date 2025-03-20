import { TrappedTag } from "#app/data/battler-tags/trapped-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Tag representing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Ingrain_(move) | Ingrain}.
 * Traps the owner and restores 1/16 of its maximum HP at the end of each turn.
 * @extends TrappedTag
 */
export class IngrainTag extends TrappedTag {
  constructor(sourceId: number) {
    super(BattlerTagType.INGRAIN, BattlerTagLapseType.TURN_END, 1, MoveId.INGRAIN, sourceId);
  }

  /**
   * Check if the Ingrain tag can be added to the pokemon
   * @param pokemon {@linkcode Pokemon} The pokemon to check if the tag can be added to
   * @returns boolean True if the tag can be added, false otherwise
   */
  override canAdd(pokemon: Pokemon): boolean {
    const isTrapped = pokemon.getTag(BattlerTagType.TRAPPED);

    return !isTrapped;
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.queuePokemonHeal(true, pokemon.getBattlerIndex(), toDmgValue(pokemon.getMaxHp() / 16), {
        message: i18next.t("battlerTags:ingrainLapse", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      });
    }

    return ret;
  }

  override getTrapMessage(pokemon: Pokemon): string {
    return i18next.t("battlerTags:ingrainOnTrap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }

  override getDescriptor(): string {
    return i18next.t("battlerTags:ingrainDesc");
  }
}
