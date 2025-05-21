import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

export class PostTurnHealAbAttr extends PostTurnAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!pokemon.isFullHp()) {
      if (!simulated) {
        const abilityName = this.source.name;
        globalScene.phaseManager.queuePokemonHealPhase(pokemon.getBattlerIndex(), toDmgValue(pokemon.getMaxHp() / 16), {
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
