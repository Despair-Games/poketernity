import { AbAttr } from "#abilities/ab-attr";
import type { IsCriticalAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Provides immunity to critical hits.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Shell_Armor_(Ability) | Shell Armor (Bulbapedia)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Battle_Armor_(Ability) | Battle Armor (Bulbapedia)}
 */
export class BlockCritAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BlockCritAbAttr";

  public override apply({ isCritical }: IsCriticalAbAttrParams): void {
    isCritical.value = false;
  }

  public override canApply({ isCritical }: Parameters<this["apply"]>[0]): boolean {
    return isCritical.value;
  }
}
