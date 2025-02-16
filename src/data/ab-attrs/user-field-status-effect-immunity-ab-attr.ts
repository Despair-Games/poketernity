import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { StatusEffect } from "#enums/status-effect";
import { PreSetStatusEffectImmunityAbAttr } from "./pre-set-status-effect-immunity-ab-attr";

/**
 * Provides immunity to status effects to the user's field.
 * @extends PreSetStatusEffectImmunityAbAttr
 */
export class UserFieldStatusEffectImmunityAbAttr extends PreSetStatusEffectImmunityAbAttr {
  constructor(...immuneEffects: StatusEffect[]) {
    super(...immuneEffects);
    this._flags.add(AbAttrFlag.USER_FIELD_STATUS_EFFECT_IMMUNITY);
  }
}
