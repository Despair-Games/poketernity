import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import { PokemonTransformPhase } from "#phases/pokemon-transform-phase";
import { randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

/**
 * Used by Imposter
 */
export class PostSummonTransformAbAttr extends PostSummonAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const targets = pokemon.getOpponents();
    if (simulated || !targets.length) {
      return simulated;
    }

    let target: Pokemon;
    if (targets.length > 1) {
      globalScene.executeWithSeedOffset(() => {
        target = randSeedItem(targets);
      }, globalScene.currentBattle.waveIndex);
    } else {
      target = targets[0];
    }
    target = target!;

    globalScene.phaseManager.unshiftPhase(
      new PokemonTransformPhase(pokemon.getBattlerIndex(), target.getBattlerIndex(), true),
    );

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("abilityTriggers:postSummonTransform", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        targetName: target.name,
      }),
    );

    return true;
  }
}
