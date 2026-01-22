import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import type { PreDefendModifyMultiplierAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Reduces the damage dealt to an allied Pokemon.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Friend_Guard_(Ability) | Friend Guard (Bulbapedia)}
 */
export class AlliedFieldDamageReductionAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "AlliedFieldDamageReductionAbAttr";

  private readonly damageMultiplier: number;

  constructor(damageMultiplier: number) {
    super();
    this.damageMultiplier = damageMultiplier;
  }

  public override apply({ multiplier }: PreDefendModifyMultiplierAbAttrParams): void {
    multiplier.value *= this.damageMultiplier;
  }
}
