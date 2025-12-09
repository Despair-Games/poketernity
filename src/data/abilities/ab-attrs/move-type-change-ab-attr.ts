import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/move-types";
import type { ValueHolder } from "#utils/common-utils";

export class MoveTypeChangeAbAttr extends PreAttackAbAttr {
  protected override readonly abAttrKey = "MoveTypeChangeAbAttr";
  private readonly newType: ElementalType;
  private readonly powerMultiplier: number;
  private readonly condition: PokemonAttackCondition;

  constructor(newType: ElementalType, powerMultiplier: number, condition: PokemonAttackCondition) {
    super();

    this.newType = newType;
    this.powerMultiplier = powerMultiplier;
    this.condition = condition;
  }

  // TODO: Decouple this into two attributes (type change / power boost)
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _move: Move,
    _defender?: Pokemon,
    moveType?: ValueHolder<number>,
    power?: ValueHolder<number>,
  ): void {
    if (moveType != null) {
      moveType.value = this.newType;
    }
    if (power != null) {
      power.value *= this.powerMultiplier;
    }
  }

  public override canApply(...[pokemon, , move, defender]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, defender, move);
  }
}
