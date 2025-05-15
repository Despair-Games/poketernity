import { NON_VOLATILE_STATUS_EFFECTS } from "#app/constants/game-constants";
import { StatusEffect } from "#enums/status-effect";
import type { ParseKeys } from "i18next";
import i18next from "i18next";

function getStatusEffectMessageKey(statusEffect: StatusEffect | undefined): string {
  switch (statusEffect) {
    case StatusEffect.POISON:
      return "statusEffect:poison";
    case StatusEffect.TOXIC:
      return "statusEffect:toxic";
    case StatusEffect.PARALYSIS:
      return "statusEffect:paralysis";
    case StatusEffect.SLEEP:
      return "statusEffect:sleep";
    case StatusEffect.FREEZE:
      return "statusEffect:freeze";
    case StatusEffect.BURN:
      return "statusEffect:burn";
    default:
      return "statusEffect:none";
  }
}

export function getStatusEffectObtainText(
  statusEffect: StatusEffect | undefined,
  pokemonNameWithAffix: string,
  sourceText?: string | null,
): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }

  if (!sourceText) {
    const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.obtain` as ParseKeys;
    return i18next.t(i18nKey, { pokemonNameWithAffix: pokemonNameWithAffix });
  }
  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.obtainSource` as ParseKeys;
  return i18next.t(i18nKey, { pokemonNameWithAffix: pokemonNameWithAffix, sourceText: sourceText });
}

export function getStatusEffectActivationText(statusEffect: StatusEffect, pokemonNameWithAffix: string): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }
  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.activation` as ParseKeys;
  return i18next.t(i18nKey, { pokemonNameWithAffix: pokemonNameWithAffix });
}

export function getStatusEffectOverlapText(statusEffect: StatusEffect, pokemonNameWithAffix: string): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }
  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.overlap` as ParseKeys;
  return i18next.t(i18nKey, { pokemonNameWithAffix: pokemonNameWithAffix });
}

export function getStatusEffectHealText(statusEffect: StatusEffect, pokemonNameWithAffix: string): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }
  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.heal` as ParseKeys;
  return i18next.t(i18nKey, { pokemonNameWithAffix: pokemonNameWithAffix });
}

export function getStatusEffectDescriptor(statusEffect: StatusEffect): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }
  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.description` as ParseKeys;
  return i18next.t(i18nKey);
}

export function getStatusEffectCatchRateMultiplier(statusEffect: StatusEffect): number {
  switch (statusEffect) {
    case StatusEffect.POISON:
    case StatusEffect.TOXIC:
    case StatusEffect.PARALYSIS:
    case StatusEffect.BURN:
      return 1.5;
    case StatusEffect.SLEEP:
    case StatusEffect.FREEZE:
      return 2.5;
  }

  return 1;
}

/**
 * Returns whether a status effect is non volatile.
 * Non-volatile status condition is a status that remains after being switched out.
 * @param status The status to check
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Status_condition#Non-volatile_status | Non-volatile status conditions - Bulbapedia}
 */
export function isNonVolatileStatusEffect(status: StatusEffect): boolean {
  return NON_VOLATILE_STATUS_EFFECTS.includes(status);
}
