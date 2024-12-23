import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { toDmgValue } from "#app/utils";
import i18next from "i18next";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

export class PostSummonAllyHealAbAttr extends PostSummonAbAttr {
  private readonly healRatio: number;
  private readonly showAnim: boolean;

  constructor(healRatio: number, showAnim: boolean = false) {
    super();

    this.healRatio = healRatio;
    this.showAnim = showAnim;
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const target = pokemon.getAlly();
    if (target?.isActive(true)) {
      if (!simulated) {
        globalScene.unshiftPhase(
          new PokemonHealPhase(target.getBattlerIndex(), toDmgValue(pokemon.getMaxHp() / this.healRatio), {
            message: i18next.t("abilityTriggers:postSummonAllyHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(target),
              pokemonName: pokemon.name,
            }),
            skipAnim: !this.showAnim,
          }),
        );
      }

      return true;
    }

    return false;
  }
}
