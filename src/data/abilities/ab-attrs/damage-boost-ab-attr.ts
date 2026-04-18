import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import type { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import type { DamageBoostAbAttrParams } from "#types/ab-attr-param-types";
import type { PokemonAttackCondition } from "#types/move-types";

/**
 * Class for abilities that boost the damage of moves.
 * @see {@linkcode VariableMovePowerAbAttr} for abilities that boost the base power of moves
 */
export class DamageBoostAbAttr extends PreAttackAbAttr {
  protected override readonly abAttrKey = "DamageBoostAbAttr";

  private readonly damageMultiplier: number;
  private readonly condition: PokemonAttackCondition;

  constructor(damageMultiplier: number, condition: PokemonAttackCondition) {
    super();

    this.damageMultiplier = damageMultiplier;
    this.condition = condition;
  }

  public override apply({ multiplier }: DamageBoostAbAttrParams): void {
    multiplier.value *= this.damageMultiplier;
  }

  public override canApply({ pokemon, move, defender }: Parameters<this["apply"]>[0]): boolean {
    return this.condition(pokemon, defender, move);
  }
}
