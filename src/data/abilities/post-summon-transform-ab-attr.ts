import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonTransformPhase } from "#app/phases/pokemon-transform-phase";
import { randSeedItem } from "#app/utils";
import i18next from "i18next";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Used by Imposter
 */
export class PostSummonTransformAbAttr extends PostSummonAbAttr {
  constructor() {
    super(true);
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const targets = pokemon.getOpponents();
    if (simulated || !targets.length) {
      return simulated;
    }

    let target: Pokemon;
    if (targets.length > 1) {
      globalScene.executeWithSeedOffset(() => {
        // in a double battle, if one of the opposing pokemon is fused the other one will be chosen
        // if both are fused, then Imposter will fail below
        if (targets[0].fusionSpecies) {
          target = targets[1];
          return;
        } else if (targets[1].fusionSpecies) {
          target = targets[0];
          return;
        }
        target = randSeedItem(targets);
      }, globalScene.currentBattle.waveIndex);
    } else {
      target = targets[0];
    }
    target = target!;

    // transforming from or into fusion pokemon causes various problems (including crashes and save corruption)
    if (target.fusionSpecies || pokemon.fusionSpecies) {
      return false;
    }

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
