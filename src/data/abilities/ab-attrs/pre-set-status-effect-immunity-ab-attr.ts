import { PreSetStatusAbAttr } from "#abilities/pre-set-status-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { getStatusEffectDescriptor } from "#app/utils/status-effect-utils";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Provides immunity to status effects to specified targets.
 * @param immuneEffects - The status effects to which the Pokémon is immune.
 * @extends PreSetStatusAbAttr
 */
export class PreSetStatusEffectImmunityAbAttr extends PreSetStatusAbAttr {
  private readonly immuneEffects: StatusEffect[];

  constructor(...immuneEffects: StatusEffect[]) {
    super();

    this.immuneEffects = immuneEffects;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, effect: StatusEffect, cancelled: BooleanHolder): boolean {
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
