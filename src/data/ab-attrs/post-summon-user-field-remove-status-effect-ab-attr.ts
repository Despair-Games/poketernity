import { getStatusEffectHealText } from "#app/data/status-effect";
import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { StatusEffect } from "#enums/status-effect";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Removes supplied status effects from the user's field.
 * @extends PostSummonAbAttr
 */
export class PostSummonUserFieldRemoveStatusEffectAbAttr extends PostSummonAbAttr {
  private statusEffect: StatusEffect[];

  /**
   * @param statusEffect - The status effects to be removed from the user's field.
   */
  constructor(...statusEffect: StatusEffect[]) {
    super(false);

    this.statusEffect = statusEffect;
  }

  /**
   * Removes supplied status effect from the user's field when user of the ability is summoned.
   *
   * @param pokemon - The Pokémon that triggered the ability.
   * @param _passive - n/a
   * @param _args - n/a
   * @returns A boolean or a promise that resolves to a boolean indicating the result of the ability application.
   */
  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const allowedPokemon = pokemon.getField().filter((p) => p.isAllowedInBattle());

    if (allowedPokemon.length < 1) {
      return false;
    }

    if (!simulated) {
      for (const pokemon of allowedPokemon) {
        if (pokemon.status && this.statusEffect.includes(pokemon.status.effect)) {
          globalScene.queueMessage(getStatusEffectHealText(pokemon.status.effect, getPokemonNameWithAffix(pokemon)));
          pokemon.resetStatus(false);
          pokemon.updateInfo();
        }
      }
    }
    return true;
  }
}
