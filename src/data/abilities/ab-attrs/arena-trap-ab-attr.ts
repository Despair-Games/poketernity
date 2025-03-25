import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import i18next from "i18next";
import { AbAttr } from "./ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

type ArenaTrapCondition = (user: Pokemon, target: Pokemon) => boolean;

/**
 * Determines whether a Pokemon is blocked from switching/running away
 * because of a trapping ability or move.
 * @extends AbAttr
 */
export class ArenaTrapAbAttr extends AbAttr {
  protected readonly arenaTrapCondition: ArenaTrapCondition;

  constructor(condition: ArenaTrapCondition) {
    super(false);
    this._flags.add(AbAttrFlag.ARENA_TRAP);
    this.arenaTrapCondition = condition;
  }
  /**
   * Checks if enemy Pokemon is trapped by an Arena Trap-esque ability:
   * - If the enemy is a Ghost type, it is not trapped
   * - If the enemy has the ability Run Away, it is not trapped.
   * - If the user has Magnet Pull and the enemy is not a Steel type, it is not trapped.
   * - If the user has Arena Trap and the enemy is not grounded, it is not trapped.
   * @param pokemon The {@link Pokemon} with this {@link AbAttr}
   * @param simulated n/a
   * @param trapped {@link BooleanHolder} indicating whether the other Pokemon is trapped or not
   * @param trappedPokemon The {@link Pokemon} that is affected by an Arena Trap ability
   * @returns `true` if enemy Pokemon is trapped
   */
  override apply(pokemon: Pokemon, _simulated: boolean, trapped: BooleanHolder, trappedPokemon: Pokemon): boolean {
    if (this.arenaTrapCondition(pokemon, trappedPokemon)) {
      if (
        trappedPokemon.getTypes(true).includes(ElementalType.GHOST)
        || (trappedPokemon.getTypes(true).includes(ElementalType.STELLAR)
          && trappedPokemon.getTypes().includes(ElementalType.GHOST))
      ) {
        trapped.value = false;
        return false;
      } else if (trappedPokemon.hasAbility(AbilityId.RUN_AWAY)) {
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
