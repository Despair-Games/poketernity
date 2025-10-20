import { PreSetStatusAbAttr } from "#abilities/pre-set-status-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";
import { getStatusEffectDescriptor } from "#utils/status-effect-utils";
import i18next from "i18next";

/**
 * Provides immunity to status effects to specified targets.
 * @param immuneEffects - The status effects to which the Pokémon is immune.
 */
export class PreSetStatusEffectImmunityAbAttr extends PreSetStatusAbAttr {
  private readonly immuneEffects: StatusEffect[];

  constructor(...immuneEffects: StatusEffect[]) {
    super(true);

    this.immuneEffects = immuneEffects;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _effect: StatusEffect,
    cancelled: ValueHolder<boolean>,
  ): void {
    cancelled.value = true;
  }

  public override canApply(...[, , effect]: Parameters<this["apply"]>): boolean {
    return this.immuneEffects.length === 0 || this.immuneEffects.includes(effect);
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string, effect: StatusEffect): string {
    return this.immuneEffects.length > 0
      ? i18next.t("abilityTriggers:statusEffectImmunityWithName", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
          statusEffectName: getStatusEffectDescriptor(effect),
        })
      : i18next.t("abilityTriggers:statusEffectImmunity", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
        });
  }
}
