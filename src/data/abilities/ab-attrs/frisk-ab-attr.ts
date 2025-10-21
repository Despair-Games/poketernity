import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import { inSpeedOrder } from "#utils/speed-order-generator";
import i18next from "i18next";

export class FriskAbAttr extends PostSummonAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      for (const opponent of inSpeedOrder(pokemon.getOpposingArenaTagSide())) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("abilityTriggers:frisk", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            opponentName: opponent.name,
            opponentAbilityName: opponent.getAbility().name,
          }),
        );
        opponent.waveData.abilitiesRevealed.push(opponent.getAbility().id);
      }
    }
  }
}
