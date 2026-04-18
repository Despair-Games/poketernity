import { AbAttr } from "#abilities/ab-attr";
import type { SuppressFieldAbilitiesAbAttrParams } from "#types/ab-attr-param-types";

// TODO: implement https://github.com/pagefaultgames/pokerogue/pull/5381 (and follow-ups)
export class SuppressFieldAbilitiesAbAttr extends AbAttr {
  protected override readonly abAttrKey = "SuppressFieldAbilitiesAbAttr";

  public override apply({ suppressed }: SuppressFieldAbilitiesAbAttrParams): void {
    suppressed.value = true;
  }

  public override canApply({ ability }: Parameters<this["apply"]>[0]): boolean {
    return ability.suppressable && !ability.hasAttr("SuppressFieldAbilitiesAbAttr");
  }
}
