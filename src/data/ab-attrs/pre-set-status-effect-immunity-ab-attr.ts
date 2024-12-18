import { getStatusEffectDescriptor } from "#app/data/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";
import { PreSetStatusAbAttr } from "./pre-set-status-ab-attr";

/**
 * Provides immunity to status effects to specified targets.
 * @param immuneEffects - The status effects to which the Pokémon is immune.
 * @extends PreSetStatusAbAttr
 */
export class PreSetStatusEffectImmunityAbAttr extends PreSetStatusAbAttr {
  private immuneEffects: StatusEffect[];

  constructor(...immuneEffects: StatusEffect[]) {
    super();

    this.immuneEffects = immuneEffects;
  }

  /**
   * Applies immunity to supplied status effects.
   *
   * @param _pokemon - The Pokémon to which the status is being applied.
   * @param _passive - n/a
   * @param effect - The status effect being applied.
   * @param cancelled - A holder for a boolean value indicating if the status application was cancelled.
   * @param _args - n/a
   * @returns A boolean indicating the result of the status application.
   */
  override applyPreSetStatus(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    effect: StatusEffect,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (this.immuneEffects.length < 1 || this.immuneEffects.includes(effect)) {
      cancelled.value = true;
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ...args: any[]): string {
    return this.immuneEffects.length
      ? i18next.t("abilityTriggers:statusEffectImmunityWithName", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
          statusEffectName: getStatusEffectDescriptor(args[0] as StatusEffect),
        })
      : i18next.t("abilityTriggers:statusEffectImmunity", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
        });
  }
}
