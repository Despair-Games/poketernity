import { AbAttr } from "#abilities/ab-attr";
import type { ConditionalCritAbAttrParams } from "#types/ab-attr-param-types";
import type { PokemonAttackCondition } from "#types/move-types";

/**
 * Guarantees a critical hit according to the given condition, except if target prevents critical hits.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Merciless_(Ability)}
 */
export class ConditionalCritAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ConditionalCritAbAttr";

  private readonly condition: PokemonAttackCondition;

  constructor(condition: PokemonAttackCondition) {
    super();

    this.condition = condition;
  }

  public override apply({ isCritical }: ConditionalCritAbAttrParams): void {
    isCritical.value = true;
  }

  public override canApply({ pokemon, target, move }: Parameters<this["apply"]>[0]): boolean {
    return this.condition(pokemon, target, move);
  }
}
