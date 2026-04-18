import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import { randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

/**
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Imposter_(Ability)}
 */
export class PostSummonTransformAbAttr extends PostSummonAbAttr {
  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
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

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.getOpponents().length > 0;
  }
}
