import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import type { IgnoreMoveEffectsAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Sets incoming moves additional effect chance to zero, ignoring all effects from moves.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Shield_Dust_(Ability) | Shield Dust (Bulbapedia)}
 */
export class IgnoreMoveEffectsAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "IgnoreMoveEffectsAbAttr";

  public override apply({ effectChance }: IgnoreMoveEffectsAbAttrParams): void {
    effectChance.value = 0;
  }

  public override canApply({ effectChance }: Parameters<this["apply"]>[0]): boolean {
    return effectChance.value > 0;
  }
}
