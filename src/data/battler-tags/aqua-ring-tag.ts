import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Tag representing the healing effect of {@link https://bulbapedia.bulbagarden.net/wiki/Aqua_Ring_(move) | Aqua Ring}.
 * Heals the owner for 1/16 of their maximum HP at the end of each turn.
 * @extends BattlerTag
 */
export class AquaRingTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.AQUA_RING, BattlerTagLapseType.TURN_END, 1, MoveId.AQUA_RING, undefined, true);
  }

  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("battlerTags:aquaRingOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
    );
  }

  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = lapseType !== BattlerTagLapseType.CUSTOM || super.lapse(pokemon, lapseType);

    if (ret) {
      globalScene.phaseManager.queuePokemonHealPhase(pokemon.getBattlerIndex(), toDmgValue(pokemon.getMaxHp() / 16), {
        message: i18next.t("battlerTags:aquaRingLapse", {
          moveName: this.getMoveName(),
          pokemonName: getPokemonNameWithAffix(pokemon),
        }),
      });
    }

    return ret;
  }
}
