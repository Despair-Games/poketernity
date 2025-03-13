import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import i18next from "i18next";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

export class PostTurnHealAbAttr extends PostTurnAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!pokemon.isFullHp()) {
      if (!simulated) {
        const abilityName = this.source.name;
        globalScene.queuePokemonHeal(true, pokemon.getBattlerIndex(), toDmgValue(pokemon.getMaxHp() / 16), {
          message: i18next.t("abilityTriggers:postTurnHeal", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            abilityName,
          }),
        });
      }

      return true;
    }

    return false;
  }
}
