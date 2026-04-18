import { AbAttr } from "#abilities/ab-attr";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { StatusEffect } from "#enums/status-effect";
import type { ConfusionOnStatusEffectAbAttrParams } from "#types/ab-attr-param-types";

/**
 * This attribute applies confusion to the target whenever the user directly poisons them with a move.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Poison_Puppeteer_(Ability)}
 */
export class ConfusionOnStatusEffectAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ConfusionOnStatusEffectAbAttr";

  /** List of effects to apply confusion after */
  // TODO: use `NonEmptyArray`
  private readonly effects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    super(false);
    this.effects = effects;
  }

  public override apply({ pokemon, simulated, defender }: ConfusionOnStatusEffectAbAttrParams): void {
    if (!simulated) {
      defender.addTag(BattlerTagType.CONFUSED, pokemon.randSeedIntRange(2, 5), undefined, defender.id);
    }
  }

  public override canApply(params: Parameters<this["apply"]>[0]): boolean {
    const { defender, effect } = params;
    return (
      super.canApply(params) // TODO: remove this `super` call? `AbAttr#canApply` will always return `true`
      && this.effects.includes(effect)
      && !defender.isFainted()
      && defender.canAddTag(BattlerTagType.CONFUSED)
    );
  }
}
