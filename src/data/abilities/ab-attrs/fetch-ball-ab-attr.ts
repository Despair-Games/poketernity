import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { getPokeballName } from "#data/pokeball";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Attribute to add the last used Pokeball in the current battle
 * back into the player's inventory.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Ball_Fetch_(Ability) | Ball Fetch}.
 * @extends PostTurnAbAttr
 */
export class FetchBallAbAttr extends PostTurnAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (simulated) {
      return false;
    }
    const lastUsed = globalScene.currentBattle.lastUsedPokeball;
    if (lastUsed !== null && pokemon.isPlayer()) {
      globalScene.pokeballCounts[lastUsed]++;
      globalScene.currentBattle.lastUsedPokeball = null;
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("abilityTriggers:fetchBall", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          pokeballName: getPokeballName(lastUsed),
        }),
      );
      return true;
    }
    return false;
  }
}
