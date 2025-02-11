import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { PreApplyBattlerTagImmunityAbAttr } from "./pre-apply-battler-tag-immunnity-ab-attr";

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to the user's field.
 * @extends PreApplyBattlerTagImmunityAbAttr
 */
export class UserFieldBattlerTagImmunityAbAttr extends PreApplyBattlerTagImmunityAbAttr {
  constructor(immuneTagTypes: BattlerTagType | BattlerTagType[]) {
    super(immuneTagTypes);
    this._flags.add(AbAttrFlag.USER_FIELD_BATTLER_TAG_IMMUNITY);
  }
}
