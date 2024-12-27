import { BattlerTagType } from "#enums/battler-tag-type";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

export class RechargeAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.RECHARGING, true, { turnCountMin: 1, lastHitOnly: true });
  }
}
