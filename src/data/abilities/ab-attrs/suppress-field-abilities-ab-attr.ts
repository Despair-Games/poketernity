import { AbAttr } from "#abilities/ab-attr";
import type { Ability } from "#abilities/ability";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class SuppressFieldAbilitiesAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.SUPPRESS_FIELD_ABILITIES);
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    suppressed: ValueHolder<boolean>,
    _ability: Ability,
  ): void {
    suppressed.value = true;
  }

  public override canApply(...[, , , ability]: Parameters<this["apply"]>): boolean {
    return ability.isSuppressable && !ability.hasAttrFlag(AbAttrFlag.SUPPRESS_FIELD_ABILITIES);
  }
}
