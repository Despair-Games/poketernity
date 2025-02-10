import { getStatusEffectDescriptor } from "#app/data/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import { StatusEffect } from "#enums/status-effect";
import i18next from "i18next";
import { PreSetStatusAbAttr } from "./pre-set-status-ab-attr";

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
    if (effect === StatusEffect.FAINT) {
      return false;
    }
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
