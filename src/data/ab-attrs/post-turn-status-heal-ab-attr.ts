import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { toDmgValue } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

/**
 * This attribute will heal 1/8th HP if the ability pokemon has the correct status.
 * @param effects The {@linkcode StatusEffect | status effect(s)} that will qualify healing the ability pokemon
 * @extends PostTurnAbAttr
 */
export class PostTurnStatusHealAbAttr extends PostTurnAbAttr {
  private effects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    super(false);

    this.effects = effects;
  }

  /**
   * @param pokemon {@linkcode Pokemon} with the ability that will receive the healing
   * @param passive N/A
   * @param _args N/A
   * @returns Returns `true` if healed from status, `false` if not
   */
  override applyPostTurn(pokemon: Pokemon, passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (pokemon.status && this.effects.includes(pokemon.status.effect)) {
      if (!pokemon.isFullHp()) {
        if (!simulated) {
          const abilityName = (!passive ? pokemon.getAbility() : pokemon.getPassiveAbility()).name;
          globalScene.unshiftPhase(
            new PokemonHealPhase(
              pokemon.getBattlerIndex(),
              toDmgValue(pokemon.getMaxHp() / 8),
              i18next.t("abilityTriggers:poisonHeal", { pokemonName: getPokemonNameWithAffix(pokemon), abilityName }),
              true,
            ),
          );
        }
        return true;
      }
    }
    return false;
  }
}
