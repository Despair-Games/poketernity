import type Pokemon from "#app/field/pokemon";
import { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { StatusEffect } from "#enums/status-effect";
import { getStatusEffectHealText } from "../status-effect";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Removes supplied status effects from the user's field.
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
    const party = pokemon instanceof PlayerPokemon ? globalScene.getPlayerField() : globalScene.getEnemyField();
    const allowedParty = party.filter((p) => p.isAllowedInBattle());

    if (allowedParty.length < 1) {
      return false;
    }

    if (!simulated) {
      for (const pokemon of allowedParty) {
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
