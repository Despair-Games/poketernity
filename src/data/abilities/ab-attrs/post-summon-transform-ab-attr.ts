import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import { canTransform } from "#moves/transform-attr";
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

    if (!canTransform(pokemon, target)) {
      return false;
    }

    globalScene.phaseManager.unshiftPhase(
      new PokemonTransformPhase(pokemon.getBattlerIndex(), target.getBattlerIndex(), true),
    );
    pokemon.addTag(BattlerTagType.TRANSFORMED);

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("abilityTriggers:postSummonTransform", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        targetName: target.name,
      }),
    );

    return true;
  }
}
