import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { StatusEffect } from "#enums/status-effect";
import { PreSetStatusEffectImmunityAbAttr } from "./pre-set-status-effect-immunity-ab-attr";

/**
 * Provides immunity to status effects to the user.
 * @extends PreSetStatusEffectImmunityAbAttr
 */
export class StatusEffectImmunityAbAttr extends PreSetStatusEffectImmunityAbAttr {
  constructor(...immuneEffects: StatusEffect[]) {
    super(...immuneEffects);
    this._flags.add(AbAttrFlag.STATUS_EFFECT_IMMUNITY);
  }
}
