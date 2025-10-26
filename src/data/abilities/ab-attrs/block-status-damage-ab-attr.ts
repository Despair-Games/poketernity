import { AbAttr } from "#abilities/ab-attr";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * This attribute will block any status damage that you put in the parameter.
 * @param effects - The {@linkcode StatusEffect | status effect(s)} that will be blocked from damaging the ability pokemon
 */
export class BlockStatusDamageAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BlockStatusDamageAbAttr";
  private readonly statusEffects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    super(false);

    this.statusEffects = effects;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return pokemon.hasStatusEffect(this.statusEffects);
  }
}
