import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveTypeChangeAbAttrParams } from "#types/ab-attr-param-types";
import type { PokemonAttackCondition } from "#types/move-types";

export class MoveTypeChangeAbAttr extends PreAttackAbAttr {
  protected override readonly abAttrKey = "MoveTypeChangeAbAttr";

  private readonly newType: ElementalType;
  private readonly condition: PokemonAttackCondition;

  constructor(newType: ElementalType, condition: PokemonAttackCondition) {
    super();

    this.newType = newType;
    this.condition = condition;
  }

  public override apply({ moveType }: MoveTypeChangeAbAttrParams): void {
    moveType.value = this.newType;
  }

  public override canApply({ pokemon, defender, move }: Parameters<this["apply"]>[0]): boolean {
    return this.condition(pokemon, defender, move);
  }
}
