import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import { inSpeedOrder } from "#utils/speed-order-generator";
import i18next from "i18next";

export class FriskAbAttr extends PostSummonAbAttr {
  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }

    for (const opponent of inSpeedOrder(pokemon.getOpposingArenaTagSide())) {
      const opponentAbility = opponent.getAbility();

      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t("abilityTriggers:frisk", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          opponentName: opponent.name,
          opponentAbilityName: opponentAbility.name,
        }),
      );

      opponent.waveData.abilitiesRevealed.add(opponentAbility.id);
    }
  }
}
