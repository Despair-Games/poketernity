import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

export class PostSummonAllyHealAbAttr extends PostSummonAbAttr {
  private readonly healRatio: number;
  private readonly showAnim: boolean;

  constructor(healRatio: number, showAnim: boolean = false) {
    super();

    this.healRatio = healRatio;
    this.showAnim = showAnim;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const target = pokemon.getAlly();
    if (target?.isActive(true)) {
      if (!simulated) {
        globalScene.phaseManager.queuePokemonHealPhase(
          target.getBattlerIndex(),
          toDmgValue(pokemon.getMaxHp() / this.healRatio),
          {
            message: i18next.t("abilityTriggers:postSummonAllyHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(target),
              pokemonName: pokemon.name,
            }),
            skipAnim: !this.showAnim,
          },
        );
      }

      return true;
    }

    return false;
  }
}
