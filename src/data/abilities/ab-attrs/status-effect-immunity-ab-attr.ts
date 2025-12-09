import { PreSetStatusEffectImmunityAbAttr } from "#abilities/pre-set-status-effect-immunity-ab-attr";

/**
 * Provides immunity to status effects to the user.
 */
export class StatusEffectImmunityAbAttr extends PreSetStatusEffectImmunityAbAttr {
  protected override readonly abAttrKey = "StatusEffectImmunityAbAttr";
}
