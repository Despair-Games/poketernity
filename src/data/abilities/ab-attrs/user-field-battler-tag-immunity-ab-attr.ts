import { PreApplyBattlerTagImmunityAbAttr } from "#abilities/pre-apply-battler-tag-immunity-ab-attr";

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to the user's field.
 */
export class UserFieldBattlerTagImmunityAbAttr extends PreApplyBattlerTagImmunityAbAttr {
  protected override readonly abAttrKey = "UserFieldBattlerTagImmunityAbAttr";
}
