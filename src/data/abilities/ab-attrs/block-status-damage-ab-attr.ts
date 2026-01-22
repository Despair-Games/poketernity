import { AbAttr } from "#abilities/ab-attr";
import type { StatusEffect } from "#enums/status-effect";
import type { CancelledAbAttrParams } from "#types/ab-attr-param-types";

/**
 * This attribute will block any status damage that you put in the parameter.
 * @param effects - The {@linkcode StatusEffect | status effect(s)} that will be blocked from damaging the ability pokemon
 */
export class BlockStatusDamageAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BlockStatusDamageAbAttr";

  // TODO: use `NonEmptyArray`
  private readonly statusEffects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    super(false);

    this.statusEffects = effects;
  }

  public override apply({ cancelled }: CancelledAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.hasStatusEffect(this.statusEffects);
  }
}
