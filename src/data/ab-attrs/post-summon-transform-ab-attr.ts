import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonTransformPhase } from "#app/phases/pokemon-transform-phase";
import { randSeedItem } from "#app/utils";
import i18next from "i18next";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Used by Imposter
 * @extends PostSummonAbAttr
 */
export class PostSummonTransformAbAttr extends PostSummonAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
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

    globalScene.unshiftPhase(new PokemonTransformPhase(pokemon.getBattlerIndex(), target.getBattlerIndex(), true));

    globalScene.queueMessage(
      i18next.t("abilityTriggers:postSummonTransform", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        targetName: target.name,
      }),
    );

    return true;
  }
}
