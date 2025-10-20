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
 */
export class FetchBallAbAttr extends PostTurnAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (simulated) {
      return;
    }

    const { lastUsedPokeball } = globalScene.currentBattle;
    if (lastUsedPokeball == null) {
      return;
    }

    globalScene.pokeballCounts[lastUsedPokeball]++;
    globalScene.currentBattle.lastUsedPokeball = null;
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:fetchBall", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        pokeballName: getPokeballName(lastUsedPokeball),
      }),
    );
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    const { lastUsedPokeball } = globalScene.currentBattle;
    return lastUsedPokeball != null && pokemon.isPlayer();
  }
}
