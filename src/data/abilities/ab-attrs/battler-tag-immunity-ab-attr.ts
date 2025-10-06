import { PreApplyBattlerTagImmunityAbAttr } from "#abilities/pre-apply-battler-tag-immunity-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to the user.
 */
export class BattlerTagImmunityAbAttr extends PreApplyBattlerTagImmunityAbAttr {
  constructor(...immuneTagTypes: BattlerTagType[]) {
    super(...immuneTagTypes);
    this._flags.add(AbAttrFlag.BATTLER_TAG_IMMUNITY);
  }
}
