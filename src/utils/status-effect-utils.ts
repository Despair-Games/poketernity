import { StatusEffect } from "#enums/status-effect";
import type { ParseKeys } from "i18next";
import i18next from "i18next";

/**
 * Retrieve the i18next message key for a {@linkcode StatusEffect}.
 * @param statusEffect - The status effect to get the i18next message key for
 * @returns The message key
 */
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

/**
 * Get the localized obtain message for a {@linkcode StatusEffect}.
 * @param statusEffect - The status effect
 * @param pokemonNameWithAffix - The name of the pokemon (with affix)
 * @param sourceText - (Optional) The source text
 * @returns The localized obtain message for the status effect
 */
export function getStatusEffectObtainText(
  statusEffect: StatusEffect,
  pokemonNameWithAffix: string,
  sourceText?: string | null,
): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }

  if (!sourceText) {
    const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.obtain` as ParseKeys;
    return i18next.t(i18nKey, { pokemonNameWithAffix });
  }

  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.obtainSource` as ParseKeys;
  return i18next.t(i18nKey, { pokemonNameWithAffix, sourceText });
}

/**
 * Get the localized activation message for a {@linkcode StatusEffect}.
 * @param statusEffect - The status effect
 * @param pokemonNameWithAffix - The name of the pokemon (with affix)
 * @returns The localized activation message for the status effect
 */
export function getStatusEffectActivationText(statusEffect: StatusEffect, pokemonNameWithAffix: string): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }
  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.activation` as ParseKeys;
  return i18next.t(i18nKey, { pokemonNameWithAffix });
}

/**
 * Get the localized overlap message for a {@linkcode StatusEffect}.
 * @param statusEffect - The status effect
 * @param pokemonNameWithAffix - The name of the pokemon (with affix)
 * @returns The localized overlap message for the status effect
 */
export function getStatusEffectOverlapText(statusEffect: StatusEffect, pokemonNameWithAffix: string): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }
  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.overlap` as ParseKeys;
  return i18next.t(i18nKey, { pokemonNameWithAffix });
}

/**
 * Get the localized heal message for a {@linkcode StatusEffect}.
 * @param statusEffect - The status effect
 * @param pokemonNameWithAffix - The name of the pokemon (with affix)
 * @returns The localized heal message for the status effect
 */
export function getStatusEffectHealText(statusEffect: StatusEffect, pokemonNameWithAffix: string): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }
  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.heal` as ParseKeys;
  return i18next.t(i18nKey, { pokemonNameWithAffix });
}

/**
 * GEt the localized description for a {@linkcode StatusEffect}.
 * @param statusEffect - The status effect
 * @returns The localized description for the status effect
 */
export function getStatusEffectDescriptor(statusEffect: StatusEffect): string {
  if (statusEffect === StatusEffect.NONE) {
    return "";
  }
  const i18nKey = `${getStatusEffectMessageKey(statusEffect)}.description` as ParseKeys;
  return i18next.t(i18nKey);
}

/**
 * Get the catch rate multiplier for a {@linkcode StatusEffect}.
 * @param statusEffect - The status effect
 * @returns The catch rate multiplier for the status effect
 */
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
