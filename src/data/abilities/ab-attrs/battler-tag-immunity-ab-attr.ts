import { PreApplyBattlerTagImmunityAbAttr } from "#abilities/pre-apply-battler-tag-immunity-ab-attr";
import type { BattlerTag } from "#battler-tags/battler-tag";

/** Provides immunity to {@linkcode BattlerTag}s to the user. */
export class BattlerTagImmunityAbAttr extends PreApplyBattlerTagImmunityAbAttr {
  protected override readonly abAttrKey = "BattlerTagImmunityAbAttr";
}
