import { BattlerTagType } from "#enums/battler-tag-type";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

/**
 * Attribute to add a "recharging" turn after the move is used.
 * @extends AddBattlerTagAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Hyper_Beam Variations of Hyper Beam}
 */
export class RechargeAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.RECHARGING, true, { turnCountMin: 1, lastHitOnly: true });
  }
}
