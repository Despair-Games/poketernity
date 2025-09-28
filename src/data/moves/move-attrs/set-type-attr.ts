import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import { ChangeTypeAttr } from "#moves/change-type-attr";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attribute to change the target's type to a set type.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Soak_(move) | Soak}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Magic_Powder_(move) | Magic Powder}.
 */
export class SetTypeAttr extends ChangeTypeAttr {
  private readonly type: ElementalType;

  constructor(type: ElementalType) {
    super(false);

    this.type = type;
  }

  protected override getType(_user: Pokemon, _target: Pokemon): ElementalType {
    return this.type;
  }

  public override getCondition(): MoveConditionFunc {
    return (user, target, move) =>
      super.getCondition()(user, target, move) && target.getTypes().some((type) => type !== this.getType(user, target));
  }
}
