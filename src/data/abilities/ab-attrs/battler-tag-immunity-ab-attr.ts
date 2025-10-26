import { PreApplyBattlerTagImmunityAbAttr } from "#abilities/pre-apply-battler-tag-immunity-ab-attr";

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to the user.
 */
export class BattlerTagImmunityAbAttr extends PreApplyBattlerTagImmunityAbAttr {
  protected override readonly abAttrKey = "BattlerTagImmunityAbAttr";
}
