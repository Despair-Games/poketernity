import { AbAttr } from "#abilities/ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { StatusEffect } from "#enums/status-effect";
import type { PreSetStatusEffectImmunityAbAttrParams } from "#types/ab-attr-param-types";
import { getStatusEffectDescriptor } from "#utils/status-effect-utils";
import i18next from "i18next";

/**
 * Provides immunity to status effects to specified targets.
 * @param immuneEffects - The status effects to which the Pokémon is immune.
 */
export abstract class PreSetStatusEffectImmunityAbAttr extends AbAttr {
  private readonly immuneEffects: StatusEffect[];

  constructor(...immuneEffects: StatusEffect[]) {
    super(true);

    this.immuneEffects = immuneEffects;
  }

  public override apply({ cancelled }: PreSetStatusEffectImmunityAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ effect }: Parameters<this["apply"]>[0]): boolean {
    return this.immuneEffects.length === 0 || this.immuneEffects.includes(effect);
  }

  public override getTriggerMessage({ pokemon, effect }: Parameters<this["apply"]>[0], abilityName: string): string {
    const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);
    const statusEffectName = getStatusEffectDescriptor(effect);
    const i18nKey = `abilityTriggers:statusEffectImmunity${this.immuneEffects.length > 0 ? "WithName" : ""}`;
    return i18next.t(i18nKey, { pokemonNameWithAffix, abilityName, statusEffectName });
  }
}
