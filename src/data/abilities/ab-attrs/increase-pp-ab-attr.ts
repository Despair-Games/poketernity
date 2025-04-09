import { abAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class IncreasePpAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(abAttrFlag.INCREASE_PP);
  }
}
