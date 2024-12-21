import { BattlerTagType } from "#enums/battler-tag-type";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

export class FlinchAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.FLINCHED, false);
  }
}
