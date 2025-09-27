import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

type ArenaTrapCondition = (user: Pokemon, target: Pokemon) => boolean;

/**
 * Determines whether a Pokemon is blocked from switching/running away
 * because of a trapping ability or move.
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
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    trapped: BooleanHolder,
    _trappedPokemon: Pokemon,
  ): void {
    trapped.value = true;
  }

  /** @returns `true` if the target Pokemon can be trapped by this effect. */
  public override canApply(...[pokemon, , , trappedPokemon]: Parameters<this["apply"]>): boolean {
    return (
      this.arenaTrapCondition(pokemon, trappedPokemon)
      && !trappedPokemon.isOfType(ElementalType.GHOST, true, true)
      && !trappedPokemon.hasAbility(AbilityId.RUN_AWAY)
    );
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return i18next.t("abilityTriggers:arenaTrap", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
