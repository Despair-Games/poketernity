import { PreSetStatusEffectImmunityAbAttr } from "#abilities/pre-set-status-effect-immunity-ab-attr";

/**
 * Provides immunity to status effects to the user's field.
 */
export class UserFieldStatusEffectImmunityAbAttr extends PreSetStatusEffectImmunityAbAttr {
  protected override readonly abAttrKey = "UserFieldStatusEffectImmunityAbAttr";
}
