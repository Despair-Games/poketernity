import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import { ChangeTypeAttr } from "#moves/change-type-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attribute to change the user's type to match that of the first move in its moveset.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Conversion_(move) | Conversion}.
 */
export class FirstMoveTypeAttr extends ChangeTypeAttr {
  constructor() {
    super(true);
  }

  protected override getType(user: Pokemon, _target: Pokemon, _move: Move): ElementalType {
    return user.getMoveset()[0].getMove().type;
  }

  public override getCondition(): MoveConditionFunc {
    return (user, target, move) =>
      super.getCondition()(user, target, move) && target.getTypes().some((t) => t !== this.getType(user, target, move));
  }
}
