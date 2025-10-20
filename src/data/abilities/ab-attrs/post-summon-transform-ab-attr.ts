import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import { randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

/**
 * Used by Imposter
 */
export class PostSummonTransformAbAttr extends PostSummonAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): void {
    const targets = pokemon.getOpponents();
    if (simulated || targets.length === 0) {
      return;
    }

    const target = randSeedItem(targets);
    const { phaseManager } = globalScene;

    phaseManager.unshiftPhase(
      phaseManager.createPhase("PokemonTransformPhase", pokemon.getBattlerIndex(), target.getBattlerIndex(), true),
      phaseManager.createPhase(
        "MessagePhase",
        i18next.t("abilityTriggers:postSummonTransform", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          targetName: target.name,
        }),
      ),
    );
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return pokemon.getOpponents().length > 0;
  }
}
