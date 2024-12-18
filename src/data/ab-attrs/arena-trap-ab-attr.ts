import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { Type } from "#enums/type";
import i18next from "i18next";
import { CheckTrappedAbAttr } from "./check-trapped-ab-attr";

/**
 * Determines whether a Pokemon is blocked from switching/running away
 * because of a trapping ability or move.
 * @extends CheckTrappedAbAttr
 * @see {@linkcode applyCheckTrapped}
 */
export class ArenaTrapAbAttr extends CheckTrappedAbAttr {
  /**
   * Checks if enemy Pokemon is trapped by an Arena Trap-esque ability:
   * - If the enemy is a Ghost type, it is not trapped
   * - If the enemy has the ability Run Away, it is not trapped.
   * - If the user has Magnet Pull and the enemy is not a Steel type, it is not trapped.
   * - If the user has Arena Trap and the enemy is not grounded, it is not trapped.
   * @param pokemon The {@link Pokemon} with this {@link AbAttr}
   * @param trapped {@link BooleanHolder} indicating whether the other Pokemon is trapped or not
   * @param otherPokemon The {@link Pokemon} that is affected by an Arena Trap ability
   * @returns `true` if enemy Pokemon is trapped
   */
  override applyCheckTrapped(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    trapped: BooleanHolder,
    otherPokemon: Pokemon,
    _args: any[],
  ): boolean {
    if (this.arenaTrapCondition(pokemon, otherPokemon)) {
      if (
        otherPokemon.getTypes(true).includes(Type.GHOST)
        || (otherPokemon.getTypes(true).includes(Type.STELLAR) && otherPokemon.getTypes().includes(Type.GHOST))
      ) {
        trapped.value = false;
        return false;
      } else if (otherPokemon.hasAbility(Abilities.RUN_AWAY)) {
        trapped.value = false;
        return false;
      }
      trapped.value = true;
      return true;
    }
    trapped.value = false;
    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:arenaTrap", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
