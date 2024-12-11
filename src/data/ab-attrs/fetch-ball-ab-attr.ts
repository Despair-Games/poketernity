import { getPokeballName } from "#app/data/pokeball";
import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

/**
 * Grabs the last failed Pokeball used
 * @extends PostTurnAbAttr
 * @see {@linkcode applyPostTurn} */
export class FetchBallAbAttr extends PostTurnAbAttr {
  /**
   * Adds the last used Pokeball back into the player's inventory
   * @param pokemon {@linkcode Pokemon} with this ability
   * @param _passive N/A
   * @param _args N/A
   * @returns true if player has used a pokeball and this pokemon is owned by the player
   */
  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (simulated) {
      return false;
    }
    const lastUsed = globalScene.currentBattle.lastUsedPokeball;
    if (lastUsed !== null && pokemon.isPlayer()) {
      globalScene.pokeballCounts[lastUsed]++;
      globalScene.currentBattle.lastUsedPokeball = null;
      globalScene.queueMessage(
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
