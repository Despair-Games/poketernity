import { AbAttr } from "#abilities/ab-attr";
import type { Ability } from "#abilities/ability";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class SuppressFieldAbilitiesAbAttr extends AbAttr {
  protected override readonly abAttrKey = "SuppressFieldAbilitiesAbAttr";

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    suppressed: ValueHolder<boolean>,
    _ability: Ability,
  ): void {
    suppressed.value = true;
  }

  public override canApply(...[, , , ability]: Parameters<this["apply"]>): boolean {
    return ability.suppressable && !ability.hasAttr("SuppressFieldAbilitiesAbAttr");
  }
}
